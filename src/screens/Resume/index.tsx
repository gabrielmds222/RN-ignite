import React, { useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';

import { categories } from '../../utils/categories';
import { 
    Container,
    Header,
    Title 
} from './styles';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: String;
    date: string;
}

interface CategoryData {
    name: string;
    total: string;
    color: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    async function loadData() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
        .filter((expensive: TransactionData) => expensive.type === 'negative')

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });

            if (categorySum > 0) {
                const total = categorySum
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                totalByCategory.push({
                    name: category.name,
                    color: category.color,
                    total,
                });
            }
        });

        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    },[]);

    return (
    <Container>
        <Header>
            <Title> Resum por categoria </Title>
        </Header>

        {totalByCategories.map(item => (
            <HistoryCard 
                title={item.name}
                amount={item.total}
                color={item.color}
            />
        ))
    }
    </Container>
    )
}
