import React, { useEffect, useState } from 'react';
import { groupCardsByCategory } from '../util/utils';
import { CATEGORIES } from '../lib/cardTypes';
import { ErrorComponent } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Quizz = () => {
	const queryClient = useQueryClient();

	const {
		data: cards,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['cards', 'quizz'],
		queryFn: async () => {
			const response = await fetch('http://localhost:8080/cards/quizz');
			const data = await response.json();
			return groupCardsByCategory(data);
		},
	});

	const mutation = useMutation({
		mutationFn: (data) => {
			return fetch(`http://localhost:8080/cards/${data.cardId}/answer`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ isValid: data.isValid }),
			});
		},
		onError: (error) => {
			console.error(error);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards', 'quizz'] });
		},
	});

	function onSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);

		const data = {
			cardId: formData.get('id'),
			isValid: formData.get('answer') === formData.get('correctAnswer'),
		};

		mutation.mutate(data);
	}

	if (isLoading || error) {
		return null;
	}

	return (
		<div className="container">
			<h1>Today Quizz :</h1>

			{Object.keys(CATEGORIES).map((type) => (
				<div key={type} >
					<h2>{type}</h2>

					{cards[type]?.length ? (
						<>
							{cards[type].map((card) => (
								<div key={card.id}>
									<p>{card.question}</p>
									<form action='POST' onSubmit={onSubmit}>
										<input type='hidden' name='id' value={card.id} />
										<input
											type='hidden'
											name='correctAnswer'
											value={card.answer}
										/>
										<input type='text' name='answer' placeholder='Your answer' />
										<button type='submit'>Answer</button>
									</form>
								</div>
							))}
						</>
					) : (
						<p>No cards for this category</p>
					)}
				</div>
			))}
		</div>
	);
};

export default Quizz;
