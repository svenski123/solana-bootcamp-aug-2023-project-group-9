interface Props {
  children: React.ReactNode;
}

export const ContentContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-full flex-col justify-between bg-black/[.45]">
      <div className="h-full items-center flex flex-col justify-between">
        {children}
      </div>
      {/* SideBar / Drawer */}
    </div>
  );
};
