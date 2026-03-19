import React from 'react';

// Badges Configuration
const badgesConfig = [
    { id: 1, name: 'Newbie', description: 'Awarded to new members.' },
    { id: 2, name: 'Contributor', description: 'For users who contribute to discussions.' },
    // Add more badges as needed
];

// Sample User Badges
const userBadges = {
    userId1: [1, 2], // Example: user with ID 'userId1' has badges 1 and 2
    // More users...
};

// Leaderboard Data
const leaderboard = [
    { username: 'User1', points: 150 },
    { username: 'User2', points: 120 },
    // More leaderboard entries...
];

const CommunityBadges = () => {
    return (
        <div>
            <h1>Community Badges</h1>
            
            <h2>Your Badges</h2>
            <ul>
                {userBadges['userId1'].map(badgeId => {
                    const badge = badgesConfig.find(b => b.id === badgeId);
                    return <li key={badge.id}>{badge.name}: {badge.description}</li>;
                })}
            </ul>
            
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map(entry => (
                    <li key={entry.username}>{entry.username}: {entry.points} points</li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityBadges;
