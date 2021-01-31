<?php
class Connection
{
	function connect()
	{

		$connection_url="localhost";

		$username='root'; // use your own mysql user name

		$password=''; // use your own mysql password

		$db_name='orderapp';

		//echo "connecting to db...";

		// make a conection to the database

		$conn = mysqli_connect( $connection_url, $username, $password ) OR

			die("Could Not Connect to Database");

		mysqli_set_charset($conn, 'utf8');


		// select the database to use

		mysqli_select_db($conn, $db_name ) OR

			die("Failed Selecting to DB");

		return $conn;
	}

	function close($conn)
	{
		mysqli_close($conn);
	}
}

?>