import React, { useState } from 'react';

const PlayfairCipher = () => {
  const [plainText, setPlainText] = useState('');
  const [key, setKey] = useState('');
  const [operation, setOperation] = useState('Encrypt');
  const [outputText, setOutputText] = useState('');

  const toLowerCase = (text) => text.toLowerCase();

  const removeSpaces = (text) => text.replace(/\s+/g, '');

  const diagraph = (text) => {
    const diagraphs = [];
    for (let i = 0; i < text.length; i += 2) {
      diagraphs.push(text.substring(i, i + 2));
    }
    return diagraphs;
  };

  const fillerLetter = (text) => {
    let newWord = '';
    for (let i = 0; i < text.length; i += 2) {
      if (text[i] === text[i + 1]) {
        newWord += text[i] + 'x' + text[i + 1];
      } else {
        newWord += text[i] + (text[i + 1] || 'z');
      }
    }
    return newWord;
  };

  const generateKeyTable = (word) => {
    const list1 = 'abcdefghiklmnopqrstuvwxyz'.split('');
    const keyLetters = Array.from(new Set(word));
    const compElements = [...keyLetters, ...list1.filter(l => !keyLetters.includes(l))];
    const matrix = [];
    for (let i = 0; i < 25; i += 5) {
      matrix.push(compElements.slice(i, i + 5));
    }
    return matrix;
  };

  const search = (mat, element) => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (mat[i][j] === element) {
          return [i, j];
        }
      }
    }
  };

  const encryptRowRule = (mat, e1r, e1c, e2r, e2c) => [
    mat[e1r][(e1c + 1) % 5],
    mat[e2r][(e2c + 1) % 5],
  ];

  const encryptColumnRule = (mat, e1r, e1c, e2r, e2c) => [
    mat[(e1r + 1) % 5][e1c],
    mat[(e2r + 1) % 5][e2c],
  ];

  const encryptRectangleRule = (mat, e1r, e1c, e2r, e2c) => [
    mat[e1r][e2c],
    mat[e2r][e1c],
  ];

  const decryptRowRule = (mat, e1r, e1c, e2r, e2c) => [
    mat[e1r][(e1c + 4) % 5],
    mat[e2r][(e2c + 4) % 5],
  ];

  const decryptColumnRule = (mat, e1r, e1c, e2r, e2c) => [
    mat[(e1r + 4) % 5][e1c],
    mat[(e2r + 4) % 5][e2c],
  ];

  const decryptRectangleRule = (mat, e1r, e1c, e2r, e2c) => [
    mat[e1r][e2c],
    mat[e2r][e1c],
  ];

  const encryptByPlayfairCipher = (matrix, plainList) => {
    return plainList.map(pair => {
      const [ele1_x, ele1_y] = search(matrix, pair[0]);
      const [ele2_x, ele2_y] = search(matrix, pair[1]);
      let encryptedPair;

      if (ele1_x === ele2_x) {
        encryptedPair = encryptRowRule(matrix, ele1_x, ele1_y, ele2_x, ele2_y);
      } else if (ele1_y === ele2_y) {
        encryptedPair = encryptColumnRule(matrix, ele1_x, ele1_y, ele2_x, ele2_y);
      } else {
        encryptedPair = encryptRectangleRule(matrix, ele1_x, ele1_y, ele2_x, ele2_y);
      }

      return encryptedPair.join('');
    }).join('');
  };

  const decryptByPlayfairCipher = (matrix, cipherList) => {
    return cipherList.map(pair => {
      const [ele1_x, ele1_y] = search(matrix, pair[0]);
      const [ele2_x, ele2_y] = search(matrix, pair[1]);
      let decryptedPair;

      if (ele1_x === ele2_x) {
        decryptedPair = decryptRowRule(matrix, ele1_x, ele1_y, ele2_x, ele2_y);
      } else if (ele1_y === ele2_y) {
        decryptedPair = decryptColumnRule(matrix, ele1_x, ele1_y, ele2_x, ele2_y);
      } else {
        decryptedPair = decryptRectangleRule(matrix, ele1_x, ele1_y, ele2_x, ele2_y);
      }

      return decryptedPair.join('');
    }).join('');
  };

  const handleProcess = () => {
    const cleanedText = removeSpaces(toLowerCase(plainText));
    const keyMatrix = generateKeyTable(toLowerCase(key));
    if (operation === 'Encrypt') {
      const preparedText = diagraph(fillerLetter(cleanedText));
      const encryptedText = encryptByPlayfairCipher(keyMatrix, preparedText);
      setOutputText(encryptedText);
    } else if (operation === 'Decrypt') {
      const preparedText = diagraph(cleanedText);
      const decryptedText = decryptByPlayfairCipher(keyMatrix, preparedText);
      setOutputText(decryptedText);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Playfair Cipher</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-2 text-lg">Enter Plain Text</label>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full mb-4"
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
        />
        <label className="block mb-2 text-lg">Enter Key</label>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full mb-4"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <label className="block mb-2 text-lg">Select Operation</label>
        <select
          className="border border-gray-300 p-2 w-full mb-4"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="Encrypt">Encrypt</option>
          <option value="Decrypt">Decrypt</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          onClick={handleProcess}
        >
          Process
        </button>
        {outputText && (
          <div className="mt-4">
            <label className="block mb-2 text-lg">Output Text</label>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full"
              value={outputText}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayfairCipher;
