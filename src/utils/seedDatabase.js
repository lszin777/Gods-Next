// src/utils/seedDatabase.js
import { db } from '../firebase'; 
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { initialVerses } from '../versesData'; 

export const seedDatabase = async () => {
  try {
    console.log("A verificar tabela de versículos no Firestore...");

    // Cria uma consulta simples para ver se já existe algum registo
    const q = query(collection(db, "verses_pool"), limit(1));
    const querySnapshot = await getDocs(q);
    
    // Se encontrar alguma coisa, não faz nada para não duplicar
    if (!querySnapshot.empty) {
      console.log("O banco de dados de versículos já contém dados.");
      return;
    }

    console.log("Banco vazio! A iniciar a gravação dos versículos...");
    
    // Percorre a lista e grava um a um no Cloud Firestore
    for (const item of initialVerses) {
      await addDoc(collection(db, "verses_pool"), item);
    }

    alert("Sucesso! Todos os versículos base foram guardados no Firestore.");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  }
};