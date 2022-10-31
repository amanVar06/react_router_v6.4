import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader, //configuring the loader
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        /**When any errors are thrown in the child routes, our new pathless route will catch it and render, preserving the root route's UI! */
        children: [
          { index: true, element: <Index /> },
          /**
           * Note the { index:true } instead of { path: "" }. That tells the router to match and render this route when the user is at the parent route's exact path, so there are no other child routes to render in the <Outlet>.
           */
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ],
      },
    ],
  },
]);

/**
 * We want the contact component to render inside of the <Root>, We do it by making the contact route a child of the root route.
 *
 * You'll now see the root layout again but a blank page on the right. We need to tell the root route where we want it to render its child routes. We do that with <Outlet>
 */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

/**
 * You may or may not have noticed, but when we click the links in the sidebar, the browser is doing a full document request for the next URL instead of using React Router.
 *
 * Client side routing allows our app to update the URL without requesting another document from the server. Instead, the app can immediately render new UI. Let's make it happen with <Link>.
 */

/**
 * Note the :contactId URL segment. The colon (:) has special meaning, turning it into a "dynamic segment". Dynamic segments will match dynamic (changing) values in that position of the URL, like the contact ID. We call these values in the URL "URL Params", or just "params" for short.

These params are passed to the loader with keys that match the dynamic segment. For example, our segment is named :contactId so the value will be passed as params.contactId.
 */

/**
 * When the user clicks the submit button:

<Form> prevents the default browser behavior of sending a new POST request to the server, but instead emulates the browser by creating a POST request with client side routing
The <Form action="destroy"> matches the new route at "contacts/:contactId/destroy" and sends it the request
After the action redirects, React Router calls all of the loaders for the data on the page to get the latest values (this is "revalidation"). useLoaderData returns new values and causes the components to update!
 */

/**
 * 
 * There are a couple of UX issues here that we can take care of quickly.

If you click back after a search, the form field still has the value you entered even though the list is no longer filtered.
If you refresh the page after searching, the form field no longer has the value in it, even though the list is filtered
In other words, the URL and our form state are out of sync.
 */
