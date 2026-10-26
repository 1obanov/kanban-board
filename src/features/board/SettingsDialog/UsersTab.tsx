import { Trash2, Users } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { AppDispatch, RootState } from "../../../store";
import type { User } from "../../../types/user";
import { addUser } from "../boardSlice";
import { removeAssignee } from "../boardThunks";

/**
 * Tab for managing assignees in board settings
 * - Add new team members
 * - Delete existing members
 * - Validates name and email fields
 */
export default function UsersTab() {
  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector((state: RootState) => state.board.users);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  /** Handle adding new user */
  const handleAddUser = (e: FormEvent<HTMLFormElement>) => {
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

    // Create new user object
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
    };

    dispatch(addUser(newUser));

    // Clear form
    setName("");
    setEmail("");
    setNameError("");
    setEmailError("");
  };

  /** Handle deleting a user */
  const handleDeleteUser = (userId: User["id"]) => {
    dispatch(removeAssignee(userId));
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
            className={`flex items-center gap-2 px-2 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50`}
            padding={"px-2 py-2"}
            disabled={!name.trim() || !email.trim()}
          >
            <Users size={14} />
            Add user
          </Button>
        </div>
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
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-2 rounded border-1 border-slate-200 p-2"
              >
                <div className="flex gap-2">
                  <span className="avatar flex h-7 w-7 items-center justify-center overflow-hidden rounded-[50%]">
                    <img src={user.avatar} alt={user.name}></img>
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-xs">{user.name}</span>
                    <span className="text-[10px] text-gray-500">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md transition-colors duration-300 hover:bg-gray-100 hover:text-red-500"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
