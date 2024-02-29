import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isFriendSelected, setIsFriendSelected] = useState(false);
  const [friendsArr, setFriendsArr] = useState(initialFriends);

  function handleNewFriend(newFriend) {
    setFriendsArr([...friendsArr, newFriend]);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          isOpen={isFriendSelected}
          onIsOpen={setIsFriendSelected}
          friendsArr={friendsArr}
        />
        <FormAddFriend
          isOpen={isAddFriendOpen}
          onHandleNewFriend={handleNewFriend}
        />
        <Button isOpen={isAddFriendOpen} onIsOpen={setIsAddFriendOpen}>
          {!isAddFriendOpen ? "Add friend" : "Close"}
        </Button>
      </div>
      <FormSplitBill isOpen={isFriendSelected} />
    </div>
  );
}

function FriendsList({ isOpen, onIsOpen, friendsArr }) {
  const friends = friendsArr;
  return (
    <ul>
      {friends.map((el) => (
        <Friend friend={el} key={el.id} isOpen={isOpen} onIsOpen={onIsOpen} />
      ))}
    </ul>
  );
}

function Friend({ friend, isOpen, onIsOpen }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      <Button isOpen={isOpen} onIsOpen={onIsOpen}>
        Select
      </Button>
    </li>
  );
}

function FormAddFriend({ isOpen, onHandleNewFriend }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  function handleOnSubmit(e) {
    e.preventDefault();

    const newFriend = {
      id: Date.now(),
      name: name,
      image: imageUrl,
      balance: 0,
    };

    onHandleNewFriend(newFriend);
  }

  return (
    isOpen && (
      <form onSubmit={(e) => handleOnSubmit(e)} className="form-add-friend">
        <label htmlFor="fname">👫 Friend name</label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="img-url">🌄 Image URL</label>
        <input
          type="url"
          name="img-url"
          id="img-url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    )
  );
}

function Button({ children, isOpen, onIsOpen }) {
  return (
    <button onClick={() => onIsOpen(!isOpen)} className="button">
      {children}
    </button>
  );
}

function FormSplitBill({ isOpen }) {
  return (
    isOpen && (
      <form className="form-split-bill">
        <h2>Split a bill with X</h2>
        <label htmlFor="bvalue">💰 Bill value</label>
        <input id="bvalue" name="bvalue" type="number" />
        <label htmlFor="yexpenses">🤕 Your expenses</label>
        <input id="yexpenses" name="yexpenses" type="number" />
        <label htmlFor="hexpense">👫 X's expense</label>
        <input id="hexpense" name="hexpense" type="number" disabled />
        <label htmlFor="whopay">🤑 Who is paying the bill</label>
        <select name="whopay" id="whopay">
          <option value="user">You</option>
          <option value="friend">X</option>
        </select>
        <Button>Split bill</Button>
      </form>
    )
  );
}
export default App;
