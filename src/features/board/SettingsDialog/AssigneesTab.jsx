import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAssignee } from "../boardSlice";
import { removeAssignee } from "../boardActions";
import { Trash2, Users } from "lucide-react";
import Button from "../../../components/Button";

/**
 * Tab for managing assignees in board settings
 * - Add new team members
 * - Delete existing members
 * - Validates name and email fields
 */
function AssigneesTab() {
  const assigneesData = useSelector((state) => state.board.assigneesData);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  /** Handle adding new user */
  const handleAddUser = (e) => {
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
    } else if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    setEmailError("");

    // Check if email already exists
    const emailExists = assigneesData.list.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      setEmailError("Email already exists");
      return;
    }

    const firstWord = name.trim().split(" ")[0].toLowerCase();

    // Create new user object
    const newUser = {
      id: firstWord,
      name,
      email,
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
    };

    dispatch(addAssignee(newUser));

    // Clear form
    setName("");
    setEmail("");
  };

  /** Handle deleting a user */
  const handleDeleteUser = (userId) => {
    dispatch(removeAssignee(userId));
  };

  return (
    <div>
      <h3 className="font-medium capitalize mb-2">Team members</h3>
      <form className="space-y-3 mb-3">
        <div className="grid md:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-700 mb-1"
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
              className={`w-full border rounded-md p-2 text-sm focus:outline-none ${
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
              className="block text-xs font-medium text-gray-700 mb-1"
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
              placeholder="Enter name"
              required
              className={`w-full border rounded-md p-2 text-sm focus:outline-none ${
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
            type="button"
            className={`text-sm flex items-center gap-2 px-2 py-2 
    ${
      !name.trim() || !email.trim()
        ? "opacity-50 hover:bg-slate-900 !cursor-default "
        : ""
    }`}
            padding={"px-2 py-2"}
            onClick={handleAddUser}
            disabled={!name.trim() || !email.trim()}
          >
            <Users size={14} />
            Add user
          </Button>
        </div>
      </form>
      <div>
        <span className="block text-xs font-medium text-gray-700 mb-1">
          Users
        </span>
        {assigneesData.list.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            No users added yet. Add team members to assign tasks.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {assigneesData.list.map((assignee) => (
              <div
                key={assignee.id}
                className="flex items-center justify-between gap-2 p-2 rounded border-1 border-slate-200"
              >
                <div className="flex gap-2">
                  <span className="avatar w-7 h-7 flex items-center justify-center rounded-[50%] overflow-hidden">
                    <img src={assignee.avatar} alt={assignee.name}></img>
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-xs">{assignee.name}</span>
                    <span className="text-[10px] text-gray-500">
                      {assignee.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  onClick={() => handleDeleteUser(assignee.id)}
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

export default AssigneesTab;
