export const generateCreateDateException = (body) => {
  let message = body.Message
  if (body.Lector || body.GroupName) {
    const lectorName = body.Lector ? body.Lector.FullName : ''
    const groupName = body.GroupName ? body.GroupName : ''
    message += `\n${lectorName}`
    if (lectorName) {
      message += ` ${groupName}`
    } else {
      message += groupName
    }
  }

  return message
}
