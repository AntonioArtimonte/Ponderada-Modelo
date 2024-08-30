"use client";

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import Link from 'next/link';

interface SearchBarProps {
  toggleSearch: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ toggleSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const allResults = ['train', 'dashboard', 'test', 'about'];
      const filteredResults = allResults.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-lg p-4 mt-2"
    >
      <TextField
        value={query}
        onChange={handleSearch}
        fullWidth
        placeholder="Search..."
        variant="outlined"
        autoFocus
      />
      {results.length > 0 && (
        <List>
          {results.map((result, index) => (
            <Link href={`/${result.toLowerCase()}`} key={index} passHref>
              <ListItem button onClick={toggleSearch}>
                <ListItemText primary={result} />
              </ListItem>
              {index < results.length - 1 && <Divider />}
            </Link>
          ))}
        </List>
      )}
    </motion.div>
  );
};

export default SearchBar;
