

const UpdateEvent = require('../updateEvents');

export class EventsController {
  addEvent(inputObject: any) {
    return UpdateEvent.create(inputObject.input).then((eventInfo: any) => {
      return eventInfo;
    });
  }

  updateEvent(inputObject: any) {
    return UpdateEvent.findOneAndUpdate({ _id: inputObject.id }, inputObject.input, { new: true }).then((eventInfo: any) => {
      return eventInfo;
    });
  }
}
