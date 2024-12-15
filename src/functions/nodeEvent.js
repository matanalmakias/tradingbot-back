import nd from "../nodeEvents/nodeEvents.js";
const nodeEvent = (text) => {
  nd.on(text, (data) => {
    io.emit(text, data);
  });
};

export default nodeEvent;
