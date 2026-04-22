export async function getAdminProfile(request, response) {
  response.status(200).json({
    user: request.user,
  });
}
