import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Index({ auth, contacts }) {
  const [localContacts, setLocalContacts] = useState(contacts.data)
  const [deleteModal, setDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)

  // sync contacts if changes are made locally
  useEffect(() => {
    setLocalContacts(contacts.data);
  }, [contacts]);

  // listen for changes to contacts and update local state
  useEffect(() => {
    window.Echo.private(`user.contacts.${auth.user.id}`)
      .listen('ContactUpdated', (event) => {
          // replace the old contact with the new one in our local state
          console.log('Event received:', event);
          const updatedContact = event.contact;
          updatedContact.created_at = formatDate(new Date(updatedContact.created_at))
          updatedContact.updated_at = formatDate(new Date(updatedContact.updated_at))
          const updatedContacts = 
            localContacts.map((c) => c.id == updatedContact.id ? updatedContact : c)
          setLocalContacts(updatedContacts);
      });

    return () => {
      window.Echo.leaveChannel('contacts');
    }
  })

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const triggerDeleteModal = (contact) => {
    setContactToDelete(contact)
    setDeleteModal(true)
  }

  const cancelDelete = () => {
    setContactToDelete(null)
    setDeleteModal(false)
  }

  const deleteContact = () => {
    router.delete(route('contact.destroy', contactToDelete.id))
    setDeleteModal(false)
    setContactToDelete(null)
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Contacts</h2>
          <Link
            href={route('contact.create')}
            className="ml-4 bg-gray-800 text-white rounded-md p-2 transform hover:scale-105"
          >
            Create new
          </Link>
        </div>
      }
    >
      <Head title="Contacts" />

      <Modal show={deleteModal}>
        <div className="py-6 px-4">
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <div className="font-bold mb-2">Are you sure?</div>
              <div>This will also delete all edit history for this contact.</div>
            </div>
            <div className="flex">
              <DangerButton  onClick={() => deleteContact()}>
                Delete
              </DangerButton>
              <SecondaryButton className="ml-3" onClick={() => cancelDelete()} >
                Cancel
              </SecondaryButton>
            </div>
          </div>
        </div>
      </Modal>
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 font-semibold">Contacts</div>
                <div className="px-6">
                  {localContacts.length === 0 &&
                  <div>You haven't created any contacts yet</div>
                  }
                  {localContacts.length > 0 && <table className="w-full text-left">
                    <thead>
                      <tr className="text-nowrap">
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Created</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>

                    <tbody>
                      {localContacts.map((contact) => (
                        <tr key={contact.id}>
                          <td>
                            <Link href={route("contact.show", contact.id)}>
                              {contact.first_name}
                            </Link>
                          </td>
                          <td>{contact.last_name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.phone_number}</td>
                          <td>{contact.created_at}</td>
                          <td>{contact.updated_at}</td>
                          <td>
                            <div className="flex">
                              <Link
                                href={route('contact.edit', contact.id)}
                                className="transform hover:scale-105"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => triggerDeleteModal(contact)}
                                className="text-red-600 ml-1 transform hover:scale-105"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>}
                  <Pagination links={contacts.meta.links} />
                </div>
            </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}