Intent smsIntent = new Intent(Intent.ACTION_VIEW);
smsIntent.setData(Uri.parse("smsto:"));
smsIntent.setType("vnd.android-dir/mms-sms");
smsIntent.putExtra("address", "+911234567890");
smsIntent.putExtra("sms_body", "Emergency! Need help at my location.");
startActivity(smsIntent);
