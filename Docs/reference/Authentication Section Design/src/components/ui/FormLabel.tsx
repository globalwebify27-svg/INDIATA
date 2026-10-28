interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormLabel({ htmlFor, required, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
