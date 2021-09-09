<?php
require_once("json_encode.php");

function validateX($xValue)
{
    return isset($xValue);
}

function validateY($yValue)
{
    $Y_MIN = -3;
    $Y_MAX = 5;

    if (!isset($yValue))
        return false;

    $numY = str_replace(',', '.', $yValue);
    return is_numeric($numY) && $numY >= $Y_MIN && $numY <= $Y_MAX;
}

function validateR($rValue)
{
    return isset($rValue) && $rValue >= 0;
}

function validateForm($xValue, $yValue, $rValue)
{
    return validateX($xValue) && validateY($yValue) && validateR($rValue);
}

function checkTriangle($xValue, $yValue, $rValue)
{
    return $xValue >= 0 && $yValue >= 0 && $yValue <= $rValue/2 - $xValue;
}

function checkRectangle($xValue, $yValue, $rValue)
{
    return $xValue <= 0 && $yValue >= 0 && abs($xValue) <= $rValue/2 && $yValue <= $rValue;
}

function checkCircle($xValue, $yValue, $rValue)
{
    return $xValue <= 0 && $yValue <= 0 && $xValue*$xValue+$yValue*$yValue <= $rValue*$rValue;
}

function checkHit($xValue, $yValue, $rValue)
{
    return checkTriangle($xValue, $yValue, $rValue) || checkRectangle($xValue, $yValue, $rValue) || checkCircle($xValue, $yValue, $rValue);
}

$xArray = [];
$xArray = $_POST['x-values'];
$rArray = [];
$rArray = $_POST['r-values'];
$yValue = $_POST['y-value'];
$timezoneOffset = $_POST['timezone'];
$currentTime = date('H:i:s', time()-$timezoneOffset*60);
$flag = false;
foreach ($xArray as $i => $xValue) {    	 
    foreach ($rArray as $j => $rValue) { 
        if (!validateForm($xValue, $yValue, $rValue))
            continue;
        $flag = true;
        $isHit = checkHit($xValue, $yValue, $rValue);
        $executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);
        $result = array(
            "success" => true,
            "xValue" => $xValue,
            "yValue" => $yValue,
            "rValue" => $rValue,
            "hit" => $isHit,
            "currentTime" => $currentTime,
            "executionTime" => $executionTime
        );
        echo toJSON($result);
        break;
    }
    if ($flag)
        break;
}
if (!$flag)
    echo toJSON(array("success" => false));
