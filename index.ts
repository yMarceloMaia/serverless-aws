module.exports.handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'hello worlddddd!',
        input: event,
      },
      null,
      2
    ),
  };
};
