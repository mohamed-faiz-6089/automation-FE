import { Link, useParams } from "react-router-dom";

export default function SuiteBreadcrumb() {
  const { projectId } = useParams();

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:underline text-blue-600">Home</Link>
      {" / "}
      <Link to={"/projectview"} className="hover:underline text-blue-600">ProjectView</Link>
      {" / "}
      <span className="text-gray-800 font-medium">Suite</span>
    </nav>
  );
}
