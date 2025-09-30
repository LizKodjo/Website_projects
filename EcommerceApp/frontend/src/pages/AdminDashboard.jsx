export default function AdminDashboard() {
  return (
    <>
      <div className="container">
        <h1 className="text-center">Admin Dashboard</h1>
        <div className="grid-responsive mt-lg">
          <div className="shadowed rounded">
            <h3>Total Users</h3>
            <p>123</p>
          </div>
          <div className="shadowed rounded">
            <h3>Total Orders</h3>
            <p>456</p>
          </div>
          <div className="shadowed rounded">
            <h3>Revenue</h3>
            <p>£12,345</p>
          </div>
        </div>
      </div>
    </>
  );
}
