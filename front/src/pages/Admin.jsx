import { ErrorComponent } from '@tanstack/react-router';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Admin = () => {
	const queryClient = useQueryClient();
	const formRef = useRef(null);

	const {
		data: cards,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['cards'],
		queryFn: async () => {
			const response = await fetch('http://localhost:8080/cards');
			const data = await response.json();
			return data;
		},
	});

	const mutation = useMutation({
		mutationFn: (data) => {
			return fetch('http://localhost:8080/cards', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
		},
		onError: (error) => {
			console.error(error);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] });
			formRef.current?.reset();
		},
	});

	function onSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = {
			question: formData.get('question'),
			answer: formData.get('answer'),
			tag: formData.get('tag'),
		};

		mutation.mutate(data);
	}

	if (isLoading || error) {
		return null;
	}

	return (
		<div className="container">
			<h1>All existing cards : </h1>

			<ul>
				{cards.map((card) => (
					<li key={card.id}>
						{card.question} - {card.category}
					</li>
				))}
			</ul>

			<h1>Add Card</h1>

			<form ref={formRef} action='POST' onSubmit={onSubmit}>
				<input type='text' name='question' placeholder='Question' />
				<input type='text' name='answer' placeholder='Answer' />
				<input type='text' name='tag' placeholder='Tag' />
				<button type='submit'>Add</button>
			</form>
		</div>
	);
};

export default Admin;
