import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "../layout/PageHeader.jsx";
import PremiumButton from "../buttons/PremiumButton.jsx";
import PremiumInput from "../forms/PremiumInput.jsx";
import PremiumModal from "../modals/PremiumModal.jsx";
import PremiumTable from "../tables/PremiumTable.jsx";
import { getStorage, setStorage } from "../../services/storageService.js";

export default function CrudPage({
  title,
  description,
  storageKey,
  initialData,
  fields,
  columns,
  buttonLabel
}) {
  const emptyForm = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(getStorage(storageKey, initialData));
  }, [storageKey, initialData]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function saveItem(event) {
    event.preventDefault();

    const required = fields.find((field) => field.required && !form[field.name]?.trim());
    if (required) return;

    const newItem = { id: Date.now(), ...form };
    const updated = [newItem, ...items];

    setItems(updated);
    setStorage(storageKey, updated);
    setForm(emptyForm);
    setOpen(false);
  }

  function deleteItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    setStorage(storageKey, updated);
  }

  const tableData = items.map((item) => ({
    ...item,
    acoes: (
      <button
        onClick={() => deleteItem(item.id)}
        className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20"
      >
        <Trash2 size={16} />
        Excluir
      </button>
    )
  }));

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4 font-black text-white shadow-[0_10px_30px_rgba(22,163,74,0.28)] hover:brightness-110"
          >
            <Plus size={20} />
            {buttonLabel}
          </button>
        }
      />

      <PremiumTable
        columns={[...columns, { key: "acoes", label: "Ações" }]}
        data={tableData}
      />

      <PremiumModal open={open} title={buttonLabel} onClose={() => setOpen(false)}>
        <form onSubmit={saveItem} className="space-y-5">
          {fields.map((field) => (
            <PremiumInput
              key={field.name}
              label={field.label}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
          ))}

          <PremiumButton type="submit">
            SALVAR
          </PremiumButton>
        </form>
      </PremiumModal>
    </>
  );
}
