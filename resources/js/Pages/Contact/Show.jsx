import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Show({auth, success, contact, contactEdits}) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Contact - {contact.first_name} {contact.last_name}</h2>
        </div>
      }
    >
      <Head title={`Contact ${contact.first_name} ${contact.last_name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex flex-col gap-y-2">
              <div className="font-bold">{contact.first_name} {contact.last_name}</div>
              <div>{contact.email}</div>
              <div>{contact.phone_number}</div>
            </div>
            <div className="flex mt-4">
              <Link 
                href={route('contact.edit', contact.id)}
                className="hover:scale-105 transform"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteContact(contact)}
                className="text-red-600 ml-3 transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mt-3">
            <div>
              <div className="font-semibold text-lg mb-2">Edit History</div>
              {!!contactEdits && contactEdits.data.length > 0 &&
                <div>
                  <table className="w-full text-left border-spacing-4">
                    <thead>
                      <tr className="text-nowrap">
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Updated</th>
                      </tr>
                    </thead>

                    <tbody>
                      {contactEdits.data.map((edit) => (
                        <tr key={edit.id}>
                          <td>
                              {edit.first_name}
                          </td>
                          <td>{edit.last_name}</td>
                          <td>{edit.email}</td>
                          <td>{edit.phone_number}</td>
                          <td>{contact.updated_at}</td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination links={contactEdits.meta.links} />
                </div>
              }
              {contactEdits.data.length == 0 &&
                <div className="text-center text-gray-600">
                  There haven't been any edits to this contact yet.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}