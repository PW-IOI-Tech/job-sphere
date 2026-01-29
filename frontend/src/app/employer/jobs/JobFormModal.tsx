import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiGrid } from "react-icons/fi";
import { FieldType, FieldTypeValue, JobFormField } from "./types";
import { useRef } from "react";
import {toast} from 'sonner';

interface JobFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (fields: JobFormField[]) => void;
  existingFields?: JobFormField[] | null;
  jobId?: number | null;
  onDeleteField?: (jobId: number, fieldId: number) => void;
}

const FIELD_TYPES = [
  { value: FieldType.TEXT, label: "Text Input" },
  { value: FieldType.NUMBER, label: "Number" },
  { value: FieldType.EMAIL, label: "Email" },
  { value: FieldType.PHONE, label: "Phone" },
  { value: FieldType.LOCATION, label: "Location" },
  { value: FieldType.RESUME_URL, label: "Resume URL" },
  { value: FieldType.FILE, label: "File Upload" },
  { value: FieldType.TEXTAREA, label: "Text Area" },
  { value: FieldType.SELECT, label: "Dropdown" },
  { value: FieldType.MULTISELECT, label: "Multi Select" },
  { value: FieldType.CHECKBOX, label: "Checkbox" },
  { value: FieldType.DATE, label: "Date" },
  { value: FieldType.YEARS_OF_EXPERIENCE, label: "Years of Experience" },
];

export default function JobFormModal({
  open,
  onClose,
  onSave,
  existingFields,
  jobId,
  onDeleteField,
}: JobFormModalProps) {
  const [fields, setFields] = useState<JobFormField[]>([]);
  const [editingField, setEditingField] = useState<JobFormField | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const idCounter = useRef<number>(Date.now());

  useEffect(() => {
    if (!open) return;

    if (existingFields && existingFields.length > 0) {
      // Edit mode → load from API
      setFields(
        existingFields.map((f, i) => ({
          ...f, 
          order: f.order || i + 1,
          fieldType: f.fieldType.toUpperCase() as FieldTypeValue,
          options: f.options || [],
          isRequired: f.isRequired,
        }))
      );
    } else {
      // Create mode → only add defaults if there are no existing fields
      setFields([
        {
          fieldType: FieldType.TEXT,
          label: "Full Name",
          isRequired: true,
          order: 1,
          options: [],
        },
        {
          fieldType: FieldType.EMAIL,
          label: "Email Address",
          isRequired: true,
          order: 2,
          options: [],
        },
        {
          fieldType: FieldType.PHONE,
          label: "Phone Number",
          isRequired: true,
          order: 3,
          options: [],
        },
        {
          fieldType: FieldType.RESUME_URL,
          label: "Resume",
          isRequired: true,
          order: 4,
          options: [],
        },
      ]);
    }
  }, [open, existingFields]);

  const validateUniqueLabel = (newLabel: string, excludeId?: number): boolean => {
    const normalizedNewLabel = newLabel.trim().toLowerCase();
    return !fields.some(field => 
      field.id !== excludeId && 
      field.label.trim().toLowerCase() === normalizedNewLabel
    );
  };

  const handleAddField = () => {
    setEditingField({
      fieldType: FieldType.TEXT,
      label: "",
      isRequired: false,
      order: fields.length + 1,
      options: [],
    });
    setShowFieldEditor(true);
  };

  const handleEditField = (field: JobFormField) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const handleSaveField = () => {
    if (!editingField || !editingField.label.trim()) {
      toast.error("Field label is required");
      return;
    }

    // Validate unique label
    if (!validateUniqueLabel(editingField.label, editingField.id)) {
      toast.error("Field label must be unique. Please choose a different label.");
      return;
    }

    const cleanedOptions = editingField.options?.filter((opt) => opt.trim() !== "") || [];

    const fieldToSave: JobFormField = {
      ...editingField,
      label: editingField.label.trim(),
      options: cleanedOptions,
    };

    const getUniqueId = () => {
      idCounter.current += 1;
      return idCounter.current;
    };

    setFields((prevFields) => {
      if (editingField.id) {
        // Update existing field by id
        return prevFields.map((f) => (f.id === editingField.id ? fieldToSave : f));
      } else {
        // Add new field with unique id
        const newField = { ...fieldToSave, id: getUniqueId(), order: prevFields.length + 1 };
        return [...prevFields, newField];
      }
    });

    setEditingField(null);
    setShowFieldEditor(false);
  };

  const handleDeleteField = async (field: JobFormField) => {
    if (field.id && jobId && onDeleteField && field.id > 1000) {
      if (window.confirm(`Are you sure you want to delete the field "${field.label}"?`)) {
        try {
          await onDeleteField(jobId, field.id);
          setFields(fields.filter((f) => f.id !== field.id));
        } catch (error) {
          console.error("Error deleting field:", error);
          toast.error("Failed to delete field. Please try again.");
        }
      }
    } else {
      setFields(fields.filter((f) => f !== field));
    }
  };

  const handleSaveForm = () => {
    if (fields.length === 0) {
      toast.error("Cannot save empty form. The default fields will be used.");
      return;
    }

    // Validate all fields have unique labels
    const labels = fields.map(f => f.label.trim().toLowerCase());
    const uniqueLabels = new Set(labels);
    if (labels.length !== uniqueLabels.size) {
      toast.error("All field labels must be unique. Please check for duplicates.");
      return;
    }

    const validFields = fields.filter((field) => field.label.trim());
    if (validFields.length !== fields.length) {
      toast.error("All fields must have labels");
      return;
    }

    // Ensure labels are trimmed before sending
    const processedFields = validFields.map(field => ({
      ...field,
      label: field.label.trim()
    }));

    onSave(processedFields);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">
            Update Job Form
          </h2>
          <button onClick={onClose} className="p-2 bg-red-400 hover:bg-red-500 rounded">
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Form Fields List */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-blue-600">Form Fields</h3>
              <button
                onClick={handleAddField}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FiPlus /> Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-medium mb-2">
                  Default form fields are automatically created when a job is posted.
                </p>
                <p className="text-blue-600 text-sm">
                  You can add additional custom fields using the &quot;Add Field&quot; button above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id || index}
                    className="border rounded-lg p-4 bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <button
                        className="cursor-grab text-gray-400 hover:text-gray-600"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <FiGrid />
                      </button>
                      <div className="flex-grow text-black">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.label}</span>
                          {field.isRequired && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {FIELD_TYPES.find((t) => t.value === field.fieldType)?.label ||
                              field.fieldType}
                          </span>
                          {field.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                        {field.options && field.options.length > 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            Options: {field.options.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditField(field)}
                        disabled={field.isDefault}
                        className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteField(field)}
                        disabled={field.isDefault}
                        className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Field Editor Modal */}
        {showFieldEditor && editingField && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md max-h-[90vh] overflow-auto">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                {editingField.id ? "Edit Field" : "Add Field"}
              </h3>
              <div className="space-y-4 text-black">
                <div>
                  <label className="block mb-1">Label</label>
                  <input
                    type="text"
                    value={editingField.label}
                    onChange={(e) =>
                      setEditingField({ ...editingField, label: e.target.value })
                    }
                    className="w-full border rounded p-2"
                    placeholder="Enter unique field label"
                  />
                </div>

                <div>
                  <label className="block mb-1">Type</label>
                  <select
                    className="w-full border rounded p-2"
                    value={editingField.fieldType}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        fieldType: e.target.value as FieldTypeValue,
                        options:
                          e.target.value === FieldType.SELECT ||
                          e.target.value === FieldType.MULTISELECT ||
                          e.target.value === FieldType.CHECKBOX
                            ? editingField.options || [""]
                            : undefined,
                      })
                    }
                  >
                    {FIELD_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {(editingField.fieldType === FieldType.SELECT ||
                  editingField.fieldType === FieldType.MULTISELECT ||
                  editingField.fieldType === FieldType.CHECKBOX) && (
                  <div>
                    <label className="block mb-1">Options (comma separated)</label>
                    <input
                      type="text"
                      value={editingField.options ? editingField.options.join(", ") : ""}
                      onChange={(e) =>
                        setEditingField({
                          ...editingField,
                          options: e.target.value
                            .split(",")
                            .map((opt) => opt.trim())
                            .filter((opt) => opt.length > 0),
                        })
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="required-checkbox"
                    checked={editingField.isRequired}
                    onChange={(e) =>
                      setEditingField({ ...editingField, isRequired: e.target.checked })
                    }
                  />
                  <label htmlFor="required-checkbox">Required</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 bg-red-600 text-white border border-gray-300 rounded hover:bg-red-700"
                  onClick={() => {
                    setShowFieldEditor(false);
                    setEditingField(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleSaveField}
                >
                  Save Field
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t">
          <button
            onClick={handleSaveForm}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-colors"
          >
            Update Form
          </button>
        </div>
      </div>
    </div>
  );
}
