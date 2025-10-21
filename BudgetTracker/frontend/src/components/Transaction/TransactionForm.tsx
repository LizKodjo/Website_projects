import { useEffect, useState, type FC } from "react";
import { getCategoryByType, type Category } from "../../utils/categories";
import { validateTransaction } from "../../utils/validation";

interface TransactionFormProps {
  onSubmit: (transaction: any) => void;
}

const TransactionForm: FC<TransactionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState({
    amount: false,
    description: false,
    category: false,
  });

  useEffect(() => {
    setAvailableCategories(getCategoryByType(formData.type));
    setFormData((prev) => ({ ...prev, category: "" }));
  }, [formData.type]);

  // Real-time validation
  useEffect(() => {
    const transaction = {
      amount: parseFloat(formData.amount) || 0,
      description: formData.description,
      category: formData.category,
      type: formData.type,
    };

    const validation = validateTransaction(transaction);

    // Only show errors for touched fields
    const visibleErrors = validation.errors.filter((error) => {
      if (error.includes("Amount") && touched.amount) return true;
      if (error.includes("Description") && touched.description) return true;
      if (error.includes("Category") && touched.category) return true;
      return false;
    });

    setErrors(visibleErrors);
  }, [formData, touched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    setTouched({ amount: true, description: true, category: true });

    const transaction = {
      amount: parseFloat(formData.amount) || 0,
      description: formData.description.trim(),
      category: formData.category || "Other",
      type: formData.type,
    };

    const validation = validateTransaction(transaction);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    console.log("📤 Sending transaction data:", transaction);
    onSubmit(transaction);
    setFormData({ amount: "", description: "", category: "", type: "expense" });
    setTouched({ amount: false, description: false, category: false });
    setErrors([]);
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            onBlur={() => handleBlur("amount")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 £{
              touched.amount && errors.some((e) => e.includes("Amount"))
                ? "border-red-300"
                : ""
            }`}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "income" | "expense",
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            onBlur={() => handleBlur("description")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 £{
              touched.description &&
              errors.some((e) => e.includes("Description"))
                ? "border-red-300"
                : ""
            }`}
            placeholder="What was this for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            onBlur={() => handleBlur("category")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 £{
              touched.category && errors.some((e) => e.includes("Category"))
                ? "border-red-300"
                : ""
            }`}
            required
          >
            <option value="">Select a category</option>
            {availableCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Preview */}
      {formData.category && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Selected Category:</p>
          <div className="flex items-center mt-1">
            <span className="text-lg mr-2">
              {
                availableCategories.find(
                  (cat) => cat.name === formData.category
                )?.icon
              }
            </span>
            <span className="font-medium">{formData.category}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={errors.length > 0}
      >
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
