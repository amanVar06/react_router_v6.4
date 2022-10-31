import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export function loader({ params }) {
  return getContact(params.contactId);
}

export default function EditContact() {
  const contact = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          {/* 
            Why is there no event.preventDefault on the button?
            A <button type="button">, while seemingly redundant, is the HTML way of preventing a button from submitting its form.
            */}
          Cancel
        </button>
      </p>
    </Form>
  );
}

/**
 * Loaders and actions can both return a Response (makes sense, since they received a Request!). The redirect helper just makes it easier to return a response that tells the app to change locations.
 *
 *
 * Without client side routing, if a server redirected after a POST request, the new page would fetch the latest data and render. As we learned before, React Router emulates this model and automatically revalidates the data on the page after the action. That's why the sidebar automatically updates when we save the form. The extra revalidation code doesn't exist without client side routing, so it doesn't need to exist with client side routing either!
 */

/**
 *
 * Note that our data model (src/contact.js) has a clientside cache, so navigating to the same contact is fast the second time. This behavior is not React Router, it will re-load data for changing routes no matter if you've been there before or not. It does, however, avoid calling the loaders for unchanging routes (like the list) during a navigation.
 */
