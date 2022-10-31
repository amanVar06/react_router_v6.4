import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact;
  /**
   * 
   *Our root errorElement is catching this unexpected error as we try to render a null contact. Nice the error was properly handled, but we can do better!

  Whenever you have an expected error case in a loader or action–like the data not existing–you can throw. The call stack will break, React Router will catch it, and the error path is rendered instead. We won't even try to render a null contact.
   */
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const contact = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || null} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  //yes this is a let for later
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  /**
   * The fetcher knows the form data being submitted to the action, so it's available to you on fetcher.formData. We'll use that to immediately update the star's state, even though the network hasn't finished. If the update eventually fails, the UI will revert to the real data.
   */

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

/**
 * we have the useFetcher hook. It allows us to communicate with loaders and actions without causing a navigation.

The ★ button on the contact page makes sense for this. We aren't creating or deleting a new record, we don't want to change pages, we simply want to change the data on the page we're looking at.


Check that out, both stars automatically update. Our new <fetcher.Form method="post"> works almost exactly like a the <Form> we've been using: it calls the action and then all data is revalidated automatically--even your errors will be caught the same way.

There is one key difference though, it's not a navigation--the URL doesn't change, the history stack is unaffected.
 */
