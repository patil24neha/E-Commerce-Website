#Code developed by Patil, Neha
#Project #4
#Fall 2017
#Username : jadrn045, 
#RED ID : 821545485

use DBI;
use CGI;
use CGI::Cookie

$q = new CGI;

my $cookie = $q->cookie(-name=>'jadrn045',-value=>'',-path=>'/');

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn045";
my $username = "jadrn045";
my $password = "success";
my $database_source = "dbi:mysql:$database:$host:$port";

	
my $dbh = DBI->connect($database_source, $username, $password) 
or die 'Can not connect to db';

my $count;
 
print "Content-type:  text/html\n\n";

my ($key, $value);
my $v = $q->cookie('jadrn045');
@rows = split('\|\|',$v);
foreach $row (@rows) {
    ($sku, $qty) = split('\|',$row);
    my $sql = "INSERT INTO prodOrder VALUES('$sku','$qty', CURDATE());";
	$count += $dbh->do($sql);
    } 

if($count > 0) 
{
  print "Success, the number of rows affected is $count\n";
}
else 
{
	print "ERROR: ".$dbh->errstr();
}

$dbh->disconnect();

