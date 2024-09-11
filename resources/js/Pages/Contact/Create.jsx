import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
export default function Create({ auth }) {
  const {data, setData, post, processing, errors} = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  })

  function submit(e) {
    e.preventDefault();

    post(route('contact.store'));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Create new contact
          </h2>
        </div>
      }
    >
      <Head title="Create new contact" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex justify-center py-6">
              <form onSubmit={submit} className="w-1/3">
                <div className="flex flex-col gap-y-3 max-w-lg">
                  <div>
                    <InputLabel>First name</InputLabel>
                    <TextInput className="w-full" type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                    <InputError message={errors.first_name} className="mt-1" />
                  </div>
                  
                  <div>
                    <InputLabel>Last name</InputLabel>
                    <TextInput className="w-full" type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                    <InputError message={errors.last_name} className="mt-1" />
                  </div>

                  <div>
                    <InputLabel>Email</InputLabel>
                    <TextInput className="w-full" type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
                    <InputError message={errors.email} className="mt-1" />
                  </div>

                  <div>
                    <InputLabel>Phone number</InputLabel>
                    <TextInput className="w-full" type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                    <InputError message={errors.phone_number} className="mt-1" />
                  </div>
                  <div className="flex">
                    <PrimaryButton 
                      type="submit"
                      className="transform hover:scale-105"
                      disabled={processing}
                    >
                      Create
                    </PrimaryButton>
                    <SecondaryButton className="hover:scale-105 transform ml-3">
                      <Link 
                        href={route('contact.index')}
                      >
                        Cancel
                      </Link>
                    </SecondaryButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    </AuthenticatedLayout>
  )
}