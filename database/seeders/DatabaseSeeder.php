<?php

namespace Database\Seeders;

use App\Enums\ScooterStatus;
use App\Models\Rental;
use App\Models\Scooter;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // RBAC
        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(AdminSeeder::class);

        // Test user with operator role
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'phone' => '+7 (999) 123-45-67',
                'password' => bcrypt('password'),
            ]
        );
        $testUser->assignRole('admin');

        // Regular user with basic read-only access
        $regularUser = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Regular User',
                'phone' => '+7 (999) 000-00-00',
                'password' => bcrypt('password'),
            ]
        );
        $regularUser->assignRole('user');

        $users = User::factory(20)->create();

        Scooter::factory(25)->available()->create();
        Scooter::factory(10)->inUse()->create();
        Scooter::factory(10)->maintenance()->create();
        Scooter::factory(5)->offline()->create();

        $scooters = Scooter::all();

        $activeScooters = $scooters->where('status', ScooterStatus::InUse)->values();
        for ($i = 0; $i < min(50, $activeScooters->count()); $i++) {
            Rental::factory()->active()->create([
                'user_id' => $users->random()->id,
                'scooter_id' => $activeScooters[$i % $activeScooters->count()]->id,
            ]);
        }

        $availableScooters = $scooters->where('status', ScooterStatus::Available)->values();
        for ($i = 0; $i < 50; $i++) {
            Rental::factory()->completed()->create([
                'user_id' => $users->random()->id,
                'scooter_id' => $availableScooters->random()->id,
            ]);
        }

        // Additional test users with roles
        $operator = User::firstOrCreate(
            ['email' => 'operator@scooter-crm.test'],
            [
                'name' => 'Operator',
                'password' => bcrypt('password'),
            ]
        );
        $operator->assignRole('operator');

        $manager = User::firstOrCreate(
            ['email' => 'manager@scooter-crm.test'],
            [
                'name' => 'Manager',
                'password' => bcrypt('password'),
            ]
        );
        $manager->assignRole('manager');
    }
}
