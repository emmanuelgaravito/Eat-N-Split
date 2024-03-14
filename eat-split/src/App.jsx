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
  const [curFriend, setCurFriend] = useState(null);
  const [friendsArr, setFriendsArr] = useState(initialFriends);

  function handleNewFriend(newFriend) {
    setFriendsArr([...friendsArr, newFriend]);
    setIsAddFriendOpen(false);
  }

  function handleFriendsBalance(id, amount) {
    setFriendsArr(
      friendsArr.map((el) =>
        el.id === id ? { ...el, balance: el.balance + amount } : el
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          curFriend={curFriend}
          onCurFriend={setCurFriend}
          friendsArr={friendsArr}
          onIsAddFriendOpen={setIsAddFriendOpen}
        />
        <FormAddFriend
          isOpen={isAddFriendOpen}
          onHandleNewFriend={handleNewFriend}
        />
        <Button
          isOpen={isAddFriendOpen}
          onIsOpen={setIsAddFriendOpen}
          onCurFriend={setCurFriend}
        >
          {!isAddFriendOpen ? "Add friend" : "Close"}
        </Button>
      </div>
      <FormSplitBill
        friendsArr={friendsArr}
        curFriend={curFriend}
        onCurFriend={setCurFriend}
        onFriendsBalance={handleFriendsBalance}
      />
    </div>
  );
}

function FriendsList({
  curFriend,
  onCurFriend,
  friendsArr,
  onIsAddFriendOpen,
}) {
  const friends = friendsArr;
  return (
    <ul>
      {friends.map((el) => (
        <Friend
          friend={el}
          key={el.id}
          curFriend={curFriend}
          onCurFriend={onCurFriend}
          onIsAddFriendOpen={onIsAddFriendOpen}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, curFriend, onCurFriend, onIsAddFriendOpen }) {
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
      <Button
        curFriend={curFriend}
        onCurFriend={onCurFriend}
        friend={friend}
        onIsAddFriendOpen={onIsAddFriendOpen}
      >
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
    if (!name || !imageUrl) return; // guard clause
    const newFriend = {
      id: crypto.randomUUID(),
      name: name,
      image: imageUrl,
      balance: 0,
    };
    onHandleNewFriend(newFriend);
    setName("");
    setImageUrl("");
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

function Button({
  children,
  onIsOpen,
  curFriend,
  onCurFriend,
  friend,
  onIsAddFriendOpen,
}) {
  function handleIsFriendSelected() {
    onCurFriend(friend.id === curFriend ? null : friend.id);
  }

  return (
    <button
      onClick={() => {
        if (children === "Select") {
          handleIsFriendSelected();
          onIsAddFriendOpen(false);
        } else {
          onIsOpen((show) => !show);
          onCurFriend(null);
        }
      }}
      className="button"
    >
      {children}
    </button>
  );
}

function FormSplitBill({ friendsArr, curFriend, onFriendsBalance }) {
  const [billValue, setBillValue] = useState("");
  const [yourExpenses, setYourExpenses] = useState("");
  const [whoPay, setWhoPay] = useState("You");

  const friendExpenses = billValue ? billValue - yourExpenses : "";

  const selectedFriend = friendsArr.filter((el) => el.id === curFriend);

  function handleSplitBill(e) {
    if (!billValue || !yourExpenses) return;
    e.preventDefault();
    if (whoPay === "You") {
      onFriendsBalance(curFriend, friendExpenses);
    } else {
      onFriendsBalance(curFriend, -yourExpenses);
    }

    setBillValue("");
    setYourExpenses("");
  }

  return (
    curFriend && (
      <form className="form-split-bill" onSubmit={(e) => handleSplitBill(e)}>
        <h2>Split a bill with {selectedFriend[0].name}</h2>
        <label htmlFor="bvalue">💰 Bill value</label>
        <input
          id="bvalue"
          name="bvalue"
          type="number"
          value={billValue}
          onChange={(e) => setBillValue(Number(e.target.value))}
        />
        <label htmlFor="yexpenses">🤕 Your expenses</label>
        <input
          id="yexpenses"
          name="yexpenses"
          type="number"
          value={yourExpenses}
          onChange={(e) =>
            setYourExpenses(
              Number(e.target.value) > billValue
                ? yourExpenses
                : Number(e.target.value)
            )
          }
        />
        <label htmlFor="hexpense">
          👫 {selectedFriend[0].name}&#39;s expense
        </label>
        <input
          id="hexpense"
          name="hexpense"
          type="number"
          value={friendExpenses}
          disabled
        />
        <label htmlFor="wpay">🤑 Who is paying the bill</label>
        <select
          name="wpay"
          id="wpay"
          value={whoPay}
          onChange={(e) => setWhoPay(e.target.value)}
        >
          <option value="You">You</option>
          <option value={selectedFriend[0].name}>
            {selectedFriend[0].name}
          </option>
        </select>
        <Button>Split bill</Button>
      </form>
    )
  );
}
export default App;
