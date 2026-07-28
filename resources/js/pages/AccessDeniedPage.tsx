export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-900">403</h1>
      <p className="mt-2 text-lg text-gray-600">Access Denied</p>
      <p className="mt-1 text-sm text-gray-500">
        You don't have permission to access any part of this application.
        Contact your administrator to get assigned a role.
      </p>
    </div>
  );
}
