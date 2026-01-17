import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center max-w-md px-6">
        <h1 className="mb-3 text-5xl font-semibold tracking-tight">404</h1>
        <p className="mb-6 text-base text-muted-foreground">
          The page <span className="font-medium text-foreground">{location.pathname}</span> was not found.
        </p>
        <Link className="story-link text-primary" to="/">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
