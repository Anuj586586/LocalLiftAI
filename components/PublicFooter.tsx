export function PublicFooter() {
  return (
    <footer className="bg-[#F8FAFC] pt-8 pb-8 px-8 lg:px-24 border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#3C2EE5] rounded grid place-items-center">
            <div className="w-2.5 h-2.5 bg-white rounded-sm" />
          </div>
          <p>© 2026 LocalLift AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
