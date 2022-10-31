import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  /**
   * The navigation.location will show up when the app is navigating to a new URL and loading the data for it. It then goes away when there is no pending navigation anymore.
   *
   * We can avoid this by replacing the current entry in the history stack with the next page, instead of pushing into it.
   */

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            {/**
             * As we've seen before, browsers can serialize forms by the name attribute of it's input elements. The name of this input is q, that's why the URL has ?q=. If we named it search the URL would be ?search=.

            Note that this form is different from the others we've used, it does not have <form method="post">. The default method is "get". That means when the browser creates the request for the next document, it doesn't put the form data into the request POST body, but into the URLSearchParams of a GET request.
             */}
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}

/**
 *
 * This first route is what we often call the "root route" since the rest of our routes will render inside of it. It will serve as the root layout of the UI, we'll have nested layouts as we get farther along.
 */

/**
 * There are two APIs we'll be using to load data, loader and useLoaderData. First we'll create and export a loader function in the root module, then we'll hook it up to the route. Finally, we'll access and render the data.
 */

/**
 *  <Form> prevents the browser from sending the request to the server and sends it to your route action instead. In web semantics, a POST usually means some data is changing. By convention, React Router uses this as a hint to automatically revalidate the data on the page after the action finishes. That means all of your useLoaderData hooks update and the UI stays in sync with your data automatically! Pretty cool.
 */

/**
 * React Router is managing all of the state behind the scenes and reveals the pieces of it you need to build dynamic web apps. In this case, we'll use the useNavigation hook.
 * 
 * useNavigation returns the current navigation state: it can be one of "idle" | "submitting" | "loading".

In our case, we add a "loading" class to the main part of the app if we're not idle. The CSS then adds a nice fade after a short delay (to avoid flickering the UI for fast loads). You could do anything you want though, like show a spinner or loading bar across the top.
 */
