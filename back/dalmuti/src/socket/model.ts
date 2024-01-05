interface RoomInfo {
    maxPeople: number;
    roomName: string;
    members: { [key: string]: string }; // 사용자 ID와 닉네임을 저장
    chatHistory: string[]; // 채팅 내역을 저장
}