import { LoaderCircle, Trash2, Users } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { AppDispatch, RootState } from "../../../store";
import type { User } from "../../../types/user";
import { addUserThunk, removeAssignee } from "../boardThunks";

/**  UsersTab component */
export default function UsersTab() {
  const dispatch = useDispatch<AppDispatch>();

  const { users, createUserStatus, createUserError } = useSelector(
    (state: RootState) => state.board,
  );

  const isSubmitting = createUserStatus === "loading";

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [deletingUserId, setDeletingUserId] = useState<User["id"] | null>(null);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  /** Handle adding new user */
  const handleAddUser = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    setNameError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!isValidEmail(email.trim())) {
      setEmailError("Invalid email format");
      return;
    }

    setEmailError("");

    // Normalize email and check if it already exists
    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = users.some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );

    if (emailExists) {
      setEmailError("Email already exists");
      return;
    }

    const newUser: Omit<User, "id"> = {
      name,
      email,
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
    };

    try {
      await dispatch(addUserThunk(newUser)).unwrap();

      setName("");
      setEmail("");
      setNameError("");
      setEmailError("");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  /** Handle deleting a user */
  const handleDeleteUser = async (userId: User["id"]): Promise<void> => {
    try {
      setDeletingUserId(userId);

      await dispatch(removeAssignee(userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div>
      <h3 className="mb-2 font-medium capitalize">Team members</h3>
      <form onSubmit={handleAddUser} className="mb-3 space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-medium text-gray-700"
            >
              Name
              <span className="text-black">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim() !== "") {
                  setNameError("");
                }
              }}
              placeholder="Enter name"
              required
              className={`w-full rounded-md border p-2 text-sm focus:outline-none ${
                nameError
                  ? "border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
            />
            {nameError && (
              <p className="mt-1 text-xs text-red-500">{nameError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium text-gray-700"
            >
              Email
              <span className="text-black">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim() !== "") {
                  setEmailError("");
                }
              }}
              placeholder="Enter email"
              required
              className={`w-full rounded-md border p-2 text-sm focus:outline-none ${
                emailError
                  ? "border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500">{emailError}</p>
            )}
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className={`flex items-center justify-center gap-2 text-sm md:justify-start`}
            minWidth="min-w-[100%] md:min-w-24"
            padding={"px-2 py-2"}
            disabledHoverBgColor="disabled:hover:bg-slate-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={10} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Users size={14} />
                Add user
              </>
            )}
          </Button>
        </div>
        {createUserError && (
          <p
            className="rounded-lg border border-red-100 bg-red-50 px-2 py-2 text-center text-sm text-red-700"
            role="alert"
          >
            {createUserError}
          </p>
        )}
      </form>
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-700">
          Users
        </span>
        {users.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            No users added yet. Add team members to assign tasks.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {users.map((user) => {
              const isDeleting = deletingUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between gap-2 rounded border border-slate-200 p-2 transition-all duration-200 ${
                    isDeleting ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <div className="flex min-w-0 gap-2">
                    <span className="avatar flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </span>

                    <div className="flex min-w-0 flex-col items-start">
                      <span className="truncate text-xs">{user.name}</span>
                      <span className="truncate text-[10px] text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={deletingUserId !== null}
                    className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    {isDeleting ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
