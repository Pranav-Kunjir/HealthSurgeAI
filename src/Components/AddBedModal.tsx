import AddBedForm from "./AddBedForm";

export const AddBedModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#111] w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <i className="ph-bold ph-x text-sm"></i>
        </button>

        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <AddBedForm />
        </div>
      </div>
    </div>
  );
};
