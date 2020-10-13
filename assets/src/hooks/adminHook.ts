import {useState, useEffect} from 'react';
import * as API from '../api';

export function useIsAdmin() {
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const currentUser = await API.me();

      setAdmin(!!currentUser && currentUser.role === 'admin');
    }

    fetchData();
  });

  return isAdmin;
}
