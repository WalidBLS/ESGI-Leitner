import React from 'react';
import { Link } from '@tanstack/react-router';

const Navbar = () => {
	return (
		<nav>
			<Link to='/' preload={false}>
				Quizz
			</Link>
			<Link to='/admin' preload={false}>
				Admin
			</Link>
		</nav>
	);
};

export default Navbar;
