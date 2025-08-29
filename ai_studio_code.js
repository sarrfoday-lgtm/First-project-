document.addEventListener('DOMContentLoaded', () => {
    const playerRows = document.getElementById('player-rows');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const playerModal = document.getElementById('player-modal');
    const closeButton = playerModal.querySelector('.close-button');
    const playerForm = document.getElementById('player-form');
    const playerNumberInput = document.getElementById('player-number');
    const playerNameInput = document.getElementById('player-name');
    const playerPositionInput = document.getElementById('player-position');

    const navItems = document.querySelectorAll('.nav-menu li');
    const appSections = document.querySelectorAll('.app-section');

    let players = JSON.parse(localStorage.getItem('basketballPlayers')) || [];
    let editingPlayerId = null; // To keep track if we are editing an existing player

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            appSections.forEach(section => section.classList.remove('active'));

            // Add 'active' to clicked nav item
            item.classList.add('active');

            // Show the corresponding section
            const targetSectionId = item.dataset.section + '-section';
            document.getElementById(targetSectionId).classList.add('active');
        });
    });


    // --- Player Management Logic ---

    // Function to render players in the table
    function renderPlayers() {
        playerRows.innerHTML = ''; // Clear existing rows
        if (players.length === 0) {
            playerRows.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No players added yet. Click "Add New Player" to get started!</td></tr>';
            return;
        }

        players.forEach(player => {
            const row = playerRows.insertRow();
            row.dataset.id = player.id; // Store player ID on the row

            row.innerHTML = `
                <td>${player.number}</td>
                <td>${player.name}</td>
                <td>${player.position || 'N/A'}</td>
                <td>${player.gamesPlayed}</td>
                <td>${player.pointsAvg.toFixed(1)}</td>
                <td class="actions-cell">
                    <button class="edit-btn" title="Edit Player">✏️</button>
                    <button class="delete-btn" title="Delete Player">🗑️</button>
                </td>
            `;

            // Add event listeners for edit and delete buttons
            row.querySelector('.edit-btn').addEventListener('click', () => editPlayer(player.id));
            row.querySelector('.delete-btn').addEventListener('click', () => deletePlayer(player.id));
        });
    }

    // Function to open the modal for adding a new player
    addPlayerBtn.addEventListener('click', () => {
        playerForm.reset(); // Clear form fields
        editingPlayerId = null; // Not editing
        playerModal.classList.add('active');
    });

    // Function to open the modal for editing an existing player
    function editPlayer(id) {
        const playerToEdit = players.find(p => p.id === id);
        if (playerToEdit) {
            playerNumberInput.value = playerToEdit.number;
            playerNameInput.value = playerToEdit.name;
            playerPositionInput.value = playerToEdit.position;
            editingPlayerId = id; // Set the ID of the player being edited
            playerModal.classList.add('active');
        }
    }

    // Function to delete a player
    function deletePlayer(id) {
        if (confirm('Are you sure you want to delete this player?')) {
            players = players.filter(p => p.id !== id);
            savePlayers();
            renderPlayers();
        }
    }

    // Handle form submission (add/edit player)
    playerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const playerNumber = parseInt(playerNumberInput.value);
        const playerName = playerNameInput.value.trim();
        const playerPosition = playerPositionInput.value.trim();

        if (playerName && playerNumber) {
            if (editingPlayerId) {
                // Edit existing player
                const playerIndex = players.findIndex(p => p.id === editingPlayerId);
                if (playerIndex > -1) {
                    players[playerIndex].number = playerNumber;
                    players[playerIndex].name = playerName;
                    players[playerIndex].position = playerPosition;
                }
            } else {
                // Add new player
                const newPlayer = {
                    id: Date.now(), // Simple unique ID
                    number: playerNumber,
                    name: playerName,
                    position: playerPosition,
                    gamesPlayed: 0,
                    pointsAvg: 0.0
                };
                players.push(newPlayer);
            }
            savePlayers();
            renderPlayers();
            playerModal.classList.remove('active'); // Close modal
        } else {
            alert('Please enter player number and name.');
        }
    });

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        playerModal.classList.remove('active');
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === playerModal) {
            playerModal.classList.remove('active');
        }
    });

    // Save players to localStorage
    function savePlayers() {
        localStorage.setItem('basketballPlayers', JSON.stringify(players));
    }

    // Initial render when the page loads
    renderPlayers();
});