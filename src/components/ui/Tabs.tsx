import React, { useState, createContext, useContext } from 'react';
interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
}
const TabsContext = createContext<TabsContextType | undefined>(undefined);
export const Tabs = ({
  children,
  defaultValue,
  onValueChange,
  value: controlledValue
}: {
  children: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}) => {
  const [value, setValue] = useState(defaultValue || '');
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
    if (controlledValue === undefined) {
      setValue(newValue);
    }
  };
  return <TabsContext.Provider value={{
    value: controlledValue ?? value,
    onChange: handleValueChange
  }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>;
};
export const TabsList = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={className}>{children}</div>;
};
export const TabsTrigger = ({
  children,
  value,
  className
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }
  const isActive = context.value === value;
  return <button className={className} onClick={() => context.onChange(value)} data-state={isActive ? 'active' : 'inactive'}>
      {children}
    </button>;
};
export const TabsContent = ({
  children,
  value
}: {
  children: React.ReactNode;
  value: string;
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }
  if (context.value !== value) {
    return null;
  }
  return <div>{children}</div>;
};