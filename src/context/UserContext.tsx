import React, {createContext, useContext, useState, ReactNode} from 'react';

interface UserContextType {
  accountType: 'want' | 'provide';
  setAccountType: (type: 'want' | 'provide') => void;
  following: Set<string>;
  setFollowing: (following: Set<string>) => void;
  addFollowing: (userName: string) => void;
  removeFollowing: (userName: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [accountType, setAccountType] = useState<'want' | 'provide'>('want');
  const [following, setFollowing] = useState<Set<string>>(
    new Set(['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez']),
  );

  const addFollowing = (userName: string) => {
    setFollowing(prev => new Set([...prev, userName]));
  };

  const removeFollowing = (userName: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      newSet.delete(userName);
      return newSet;
    });
  };

  return (
    <UserContext.Provider
      value={{
        accountType,
        setAccountType,
        following,
        setFollowing,
        addFollowing,
        removeFollowing,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


