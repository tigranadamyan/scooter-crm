<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed permissions and roles
        $this->seed(\Database\Seeders\PermissionSeeder::class);
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private function createUserWithRole(string $role): User
    {
        $user = User::factory()->create();
        $user->assignRole($role);
        return $user;
    }

    private function jsonHeaders(User $user): array
    {
        Sanctum::actingAs($user, ['*']);
        return ['Accept' => 'application/json'];
    }

    // ---------------------------------------------------------------
    // Login / Auth
    // ---------------------------------------------------------------

    public function test_login_returns_roles_and_permissions(): void
    {
        $user = $this->createUserWithRole('admin');

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'roles', 'permissions'],
                'token',
            ])
            ->assertJson(['user' => ['roles' => ['admin']]]);

        $this->assertNotEmpty($response->json('user.permissions'));
    }

    public function test_unauthenticated_access_is_rejected(): void
    {
        $endpoints = [
            ['GET', '/api/dashboard'],
            ['GET', '/api/scooters'],
            ['POST', '/api/scooters'],
            ['GET', '/api/scooters/1'],
            ['PUT', '/api/scooters/1'],
            ['DELETE', '/api/scooters/1'],
            ['GET', '/api/rentals'],
            ['GET', '/api/rentals/1'],
            ['POST', '/api/rentals'],
            ['PATCH', '/api/rentals/1/complete'],
        ];

        foreach ($endpoints as [$method, $url]) {
            $response = $this->json(strtoupper($method), $url);
            $this->assertNotEquals(200, $response->status(), "Unauthenticated request to {$method} {$url} should not return 200");
        }
    }

    // ---------------------------------------------------------------
    // Admin — full access to everything
    // ---------------------------------------------------------------

    public function test_admin_can_access_dashboard(): void
    {
        $admin = $this->createUserWithRole('admin');
        $response = $this->getJson(route('dashboard'), $this->jsonHeaders($admin));
        $response->assertOk();
    }

    public function test_admin_can_list_scooters(): void
    {
        $admin = $this->createUserWithRole('admin');
        $response = $this->getJson(route('scooters.index'), $this->jsonHeaders($admin));
        $response->assertOk();
    }

    public function test_admin_can_create_scooter(): void
    {
        $admin = $this->createUserWithRole('admin');
        $response = $this->postJson(route('scooters.store'), [
            'number' => 'SC-9999',
            'model' => 'Test Model',
            'status' => 'available',
            'battery_level' => 100,
            'latitude' => 55.75,
            'longitude' => 37.62,
        ], $this->jsonHeaders($admin));
        $response->assertCreated();
    }

    public function test_admin_can_list_rentals(): void
    {
        $admin = $this->createUserWithRole('admin');
        $response = $this->getJson(route('rentals.index'), $this->jsonHeaders($admin));
        $response->assertOk();
    }

    // ---------------------------------------------------------------
    // Operator — scooters (view/update) + rentals (view/create/complete)
    // ---------------------------------------------------------------

    public function test_operator_cannot_access_dashboard(): void
    {
        $operator = $this->createUserWithRole('operator');
        $response = $this->getJson(route('dashboard'), $this->jsonHeaders($operator));
        $response->assertForbidden();
    }

    public function test_operator_can_list_scooters(): void
    {
        $operator = $this->createUserWithRole('operator');
        $response = $this->getJson(route('scooters.index'), $this->jsonHeaders($operator));
        $response->assertOk();
    }

    public function test_operator_can_update_scooter(): void
    {
        $operator = $this->createUserWithRole('operator');
        $scooter = \App\Models\Scooter::factory()->create();

        $response = $this->putJson(route('scooters.update', $scooter->id), [
            'number' => $scooter->number,
            'model' => $scooter->model,
            'status' => $scooter->status->value,
            'battery_level' => 50,
            'latitude' => $scooter->latitude,
            'longitude' => $scooter->longitude,
        ], $this->jsonHeaders($operator));
        $response->assertOk();
    }

    public function test_operator_cannot_create_scooter(): void
    {
        $operator = $this->createUserWithRole('operator');
        $response = $this->postJson(route('scooters.store'), [
            'number' => 'SC-0000',
            'model' => 'Test',
        ], $this->jsonHeaders($operator));
        $response->assertForbidden();
    }

    public function test_operator_cannot_delete_scooter(): void
    {
        $operator = $this->createUserWithRole('operator');
        $scooter = \App\Models\Scooter::factory()->create();

        $response = $this->deleteJson(route('scooters.destroy', $scooter->id), [], $this->jsonHeaders($operator));
        $response->assertForbidden();
    }

    public function test_operator_can_list_rentals(): void
    {
        $operator = $this->createUserWithRole('operator');
        $response = $this->getJson(route('rentals.index'), $this->jsonHeaders($operator));
        $response->assertOk();
    }

    public function test_operator_can_create_rental(): void
    {
        $operator = $this->createUserWithRole('operator');
        $user = User::factory()->create();
        $scooter = \App\Models\Scooter::factory()->available()->create();

        $response = $this->postJson(route('rentals.store'), [
            'user_id' => $user->id,
            'scooter_id' => $scooter->id,
        ], $this->jsonHeaders($operator));
        $response->assertCreated();
    }

    public function test_operator_can_complete_rental(): void
    {
        $operator = $this->createUserWithRole('operator');
        $rental = \App\Models\Rental::factory()->create(['status' => 'active', 'end_time' => null]);

        $response = $this->patchJson(route('rentals.complete', $rental->id), [], $this->jsonHeaders($operator));
        $response->assertOk();
    }

    // ---------------------------------------------------------------
    // Manager — dashboard.view + scooters.view (read-only)
    // ---------------------------------------------------------------

    public function test_manager_can_access_dashboard(): void
    {
        $manager = $this->createUserWithRole('manager');
        $response = $this->getJson(route('dashboard'), $this->jsonHeaders($manager));
        $response->assertOk();
    }

    public function test_manager_can_list_scooters(): void
    {
        $manager = $this->createUserWithRole('manager');
        $response = $this->getJson(route('scooters.index'), $this->jsonHeaders($manager));
        $response->assertOk();
    }

    public function test_manager_cannot_create_scooter(): void
    {
        $manager = $this->createUserWithRole('manager');
        $response = $this->postJson(route('scooters.store'), [
            'number' => 'SC-0000',
            'model' => 'Test',
        ], $this->jsonHeaders($manager));
        $response->assertForbidden();
    }

    public function test_manager_cannot_update_scooter(): void
    {
        $manager = $this->createUserWithRole('manager');
        $scooter = \App\Models\Scooter::factory()->create();

        $response = $this->putJson(route('scooters.update', $scooter->id), [
            'battery_level' => 50,
        ], $this->jsonHeaders($manager));
        $response->assertForbidden();
    }

    public function test_manager_cannot_delete_scooter(): void
    {
        $manager = $this->createUserWithRole('manager');
        $scooter = \App\Models\Scooter::factory()->create();

        $response = $this->deleteJson(route('scooters.destroy', $scooter->id), [], $this->jsonHeaders($manager));
        $response->assertForbidden();
    }

    public function test_manager_cannot_access_rentals(): void
    {
        $manager = $this->createUserWithRole('manager');
        $response = $this->getJson(route('rentals.index'), $this->jsonHeaders($manager));
        $response->assertForbidden();
    }

    public function test_manager_cannot_create_rental(): void
    {
        $manager = $this->createUserWithRole('manager');
        $response = $this->postJson(route('rentals.store'), [
            'user_id' => 1,
            'scooter_id' => 1,
        ], $this->jsonHeaders($manager));
        $response->assertForbidden();
    }

    // ---------------------------------------------------------------
    // User without any role — no access to permission-protected routes
    // ---------------------------------------------------------------

    public function test_user_without_role_cannot_access_dashboard(): void
    {
        $user = User::factory()->create();
        $response = $this->getJson(route('dashboard'), $this->jsonHeaders($user));
        $response->assertForbidden();
    }

    public function test_user_without_role_cannot_access_scooters(): void
    {
        $user = User::factory()->create();
        $response = $this->getJson(route('scooters.index'), $this->jsonHeaders($user));
        $response->assertForbidden();
    }

    public function test_user_without_role_cannot_access_rentals(): void
    {
        $user = User::factory()->create();
        $response = $this->getJson(route('rentals.index'), $this->jsonHeaders($user));
        $response->assertForbidden();
    }

    // ---------------------------------------------------------------
    // Auth: logout
    // ---------------------------------------------------------------

    public function test_authenticated_user_can_logout(): void
    {
        $user = $this->createUserWithRole('admin');
        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/logout');
        $response->assertNoContent();

        // Verify the token was deleted
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
