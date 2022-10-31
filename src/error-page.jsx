import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

/*
Note that useRouteError provides the error that was thrown. When the user navigates to routes that don't exist you'll get an error response with a "Not Found" statusText. We'll see some other errors later in the tutorial and discuss them more.

For now, it's enough to know that pretty much all of your errors will now be handled by this page instead of infinite spinners, unresponsive pages, or blank screens 
*/
