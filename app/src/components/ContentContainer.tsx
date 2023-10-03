interface Props {
  children: React.ReactNode;
}

export const ContentContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-auto flex-col justify-between">
      <div className="items-center drawer-content flex flex-col justify-between">
        {children}
      </div>
      {/* SideBar / Drawer */}
    </div>
  );
};
