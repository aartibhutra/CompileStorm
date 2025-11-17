export default function Modal({ open, title, placeholder, onClose, onSubmit }) {
  if (!open) return null;

  let value = "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-80 shadow-lg border border-zinc-700">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>

        <input
          type="text"
          className="w-full p-2 mb-4 bg-zinc-900 text-white border border-zinc-700 rounded"
          placeholder={placeholder}
          autoFocus
          onChange={(e) => (value = e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-zinc-600 rounded text-white"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 bg-indigo-600 rounded text-white"
            onClick={() => onSubmit(value)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
