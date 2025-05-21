import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

const initialForm: User = {
  id: 0,
  name: "",
  email: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
  },
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<User>(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const respuesta = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await respuesta.json();
      setUsers(data); // Aquí seteamos directamente
      localStorage.setItem("users", JSON.stringify(data)); // Guardamos
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const openNewUserForm = () => {
    setFormData({ ...initialForm, id: users.length + 1 });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditForm = (user: User) => {
    setFormData(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["street", "suite", "city", "zipcode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === formData.id ? formData : u))
      );
    } else {
      setUsers((prev) => [...prev, formData]);
    }

    setShowModal(false);
    setFormData(initialForm);
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={openNewUserForm}
          className="bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          New User
        </button>
      </div>

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Street</th>
            <th className="border px-4 py-2">Suite</th>
            <th className="border px-4 py-2">Zipcode</th>
            <th className="border px-4 py-2">City</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.address.street}</td>
              <td className="border px-4 py-2">{user.address.suite}</td>
              <td className="border px-4 py-2">{user.address.zipcode}</td>
              <td className="border px-4 py-2">{user.address.city}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => openEditForm(user)}
                  className=" py-3 px-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 hover:text-blue-500 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="  py-4 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-4 hover:text-red-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-lg bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street"
                className="w-full p-2 border rounded"
              />
              <input
                name="suite"
                value={formData.address.suite}
                onChange={handleChange}
                placeholder="Suite"
                className="w-full p-2 border rounded"
              />
              <input
                name="zipcode"
                value={formData.address.zipcode}
                onChange={handleChange}
                placeholder="Zipcode"
                className="w-full p-2 border rounded"
              />
              <input
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full p-2 border rounded"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
