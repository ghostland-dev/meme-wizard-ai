import { Dashboard } from "@/components/dashboard";

const DashboardPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Gérez vos memes et suivez vos performances
        </p>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;