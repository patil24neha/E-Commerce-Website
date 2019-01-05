#Code developed by Patil, Neha
#Project #4
#Fall 2017
#Username : jadrn045, 
#RED ID : 821545485 

use DBI;

print <<END_HTML;
Content-type: text/html

<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html>

<head>
	<title>Sales Report</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="http://jadran.sdsu.edu/~jadrn045/proj4/MyCSS.css"/>
</head>

<body><div>
<h1>Bertha's Deluxe Chocolates Sales Report</h1>

<table id="report">
<tr>
<th>SKU</th>
<th>Order Date</th>
<th>Cost Price</th>
<th>Retail Price</th>
<th>Total Quantity</th>
<th>Total Cost</th>
<th>Total Retail</th>
<th>Profit</th>

</tr>
END_HTML

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn045";
my $username = "jadrn045";
my $password = "success";
my $database_source = "dbi:mysql:$database:$host:$port";
	
my $dbh = DBI->connect($database_source, $username, $password) 
or die 'Cannot connect to db';


my $sth = $dbh->prepare("SELECT p1.sku, p1.orderDate, p2.cost, p2.retail, sum(p1.quantity) as total_quantity,
	round(sum(p1.quantity)* p2.cost ,2) as Total_cost,
	round(sum(p1.quantity)* p2.retail,2) as Total_Retail_cost,
	round(((sum(p1.quantity)* p2.retail)-(sum(p1.quantity)* p2.cost)),2)  as Profit FROM prodOrder p1, proj4.products p2 where p1.sku=p2.sku group by p1.sku order by p1.orderDate,p1.sku");

$sth->execute();

my $grossquant;
my $grosscost;
my $grossretail;
my $grossprofit;

while(my @row=$sth->fetchrow_array()) {
    print "\t<tr>\n";
	print "<td>".$row[0]."</td>";
	print "<td>".$row[1]."</td>";
	print "<td>".$row[2]."</td>";
	print "<td>".$row[3]."</td>";
	print "<td>".$row[4]."</td>";
	print "<td>".$row[5]."</td>";
	print "<td>".$row[6]."</td>";
	print "<td>".$row[7]."</td>";

    
	$grossquant +=$row[4];
	$grosscost +=$row[5];
	$grossretail +=$row[6];
	$grossprofit +=$row[7];
	print "\t</tr>\n";
  }

   print "\t<tr class='grand'>\n";

	print "<td class='total' colspan='4'> Grand Total </td>";
	print "<td>".$grossquant."</td>";
	print "<td>".$grosscost."</td>";
	print "<td>".$grossretail."</td>";
	print "<td>".$grossprofit."</td>";
	print "\t</tr>\n";
	
$sth->finish();
$dbh->disconnect();

    	

print "</table>\n";
print "</div>\n";

print "</body>\n";
print "</html>\n";






