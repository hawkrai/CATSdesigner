<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
	<xsl:output method="html" indent="yes"/>

	<xsl:param name="lang" select="'ru'"/>

	<xsl:variable name="t_approve">
		<xsl:choose>
			<xsl:when test="$lang='en'">Approved</xsl:when>
			<xsl:otherwise>Утверждаю</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_head_cathedra">
		<xsl:choose>
			<xsl:when test="$lang='en'">Head of Department</xsl:when>
			<xsl:otherwise>Заведующий кафедрой</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_signature">
		<xsl:choose>
			<xsl:when test="$lang='en'">(signature)</xsl:when>
			<xsl:otherwise>(подпись)</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_name_initials">
		<xsl:choose>
			<xsl:when test="$lang='en'">(surname, initials)</xsl:when>
			<xsl:otherwise>(фамилия, инициалы)</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_signature_date">
		<xsl:choose>
			<xsl:when test="$lang='en'">(date, signature)</xsl:when>
			<xsl:otherwise>(дата, подпись)</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_title">
		<xsl:choose>
			<xsl:when test="$lang='en'">GRADUATION PROJECT ASSIGNMENT</xsl:when>
			<xsl:otherwise>ЗАДАНИЕ ПО ДИПЛОМНОМУ ПРОЕКТИРОВАНИЮ</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_student_group">
		<xsl:choose>
			<xsl:when test="$lang='en'">For student of the group</xsl:when>
			<xsl:otherwise>Cтуденту-дипломнику группы</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_group_number">
		<xsl:choose>
			<xsl:when test="$lang='en'">number</xsl:when>
			<xsl:otherwise>номер</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_initials_surname">
		<xsl:choose>
			<xsl:when test="$lang='en'">initials and surname</xsl:when>
			<xsl:otherwise>инициалы и фамилия</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item1">
		<xsl:choose>
			<xsl:when test="$lang='en'">1. Graduation project theme</xsl:when>
			<xsl:otherwise>1. Тема проекта</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item2">
		<xsl:choose>
			<xsl:when test="$lang='en'">2. Deadline for student to submit completed project</xsl:when>
			<xsl:otherwise>2. Срок сдачи студентом законченного проекта</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item3">
		<xsl:choose>
			<xsl:when test="$lang='en'">3. Initial data for the project</xsl:when>
			<xsl:otherwise>3. Исходные данные к проекту</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item4">
		<xsl:choose>
			<xsl:when test="$lang='en'">4. Contents of the explanatory note</xsl:when>
			<xsl:otherwise>4. Содержание расчетно-пояснительной записки</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item5">
		<xsl:choose>
			<xsl:when test="$lang='en'">5. List of graphic materials</xsl:when>
			<xsl:otherwise>5. Перечень графического материала</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item6">
		<xsl:choose>
			<xsl:when test="$lang='en'">6. Project consultants (with section references)</xsl:when>
			<xsl:otherwise>6. Консультанты по проекту (с указанием разделов проекта)</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item7">
		<xsl:choose>
			<xsl:when test="$lang='en'">7. Assignment issue date</xsl:when>
			<xsl:otherwise>7. Дата выдачи задания</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item8">
		<xsl:choose>
			<xsl:when test="$lang='en'">8. Project work schedule for the entire period</xsl:when>
			<xsl:otherwise>8. Календарный график работы над проектом на весь период</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_item8_sub">
		<xsl:choose>
			<xsl:when test="$lang='en'">(indicating the labour intensity of individual stages)</xsl:when>
			<xsl:otherwise>(с указанием трудоемкости отдельных этапов)</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_supervisor">
		<xsl:choose>
			<xsl:when test="$lang='en'">Graduation project supervisor</xsl:when>
			<xsl:otherwise>Руководитель</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="t_student_accepted">
		<xsl:choose>
			<xsl:when test="$lang='en'">Student accepted the assignment</xsl:when>
			<xsl:otherwise>Студент-дипломник задание принял к исполнению</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:template match="YearlyWorks">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
				<title>Белорусский национальный технический университет</title>
				<style>
					<![CDATA[
@font-face
{
	font-family:Impact;
	panose-1:2 11 8 6 3 9 2 5 2 4;
}
p.MsoNormal, li.MsoNormal, div.MsoNormal
{
	margin:0cm;
	margin-bottom:.0001pt;
	text-align:justify;
	line-height:150%;
	font-size:12.0pt;
	font-family:"Times New Roman";
}
@page Section1
{
	size:595.3pt 841.9pt;
	margin:1.0cm 42.55pt 2.0cm 70.9pt;
}
div.Section1
{
	page:Section1;
}
]]>
				</style>
			</head>
			<body lang="RU">
				<div class="Section1">
					<br></br>
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr>
							<td width="100%" valign="bottom" style='width:478.5pt;border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='font-size:15pt;text-align:center;line-height:normal'>
									<xsl:value-of select='string(item[@name="Univer"])' disable-output-escaping='no'/>
								</p>
							</td>
						</tr>
						<tr>
							<td width="100%" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'><![CDATA[ ]]></span>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse;margin-top:10px'>
						<tr>
							<td width="100%" valign="top" style='border:none;padding:0cm 1.4pt 0cm 1.4pt'>
								<p class="MsoNormal" align="center" style='font-size:15pt;text-align:center;line-height:normal'>
									<xsl:value-of select='string(item[@name="Faculty"])' disable-output-escaping='no'/>
								</p>
							</td>
						</tr>
					</table>
					<br></br>
					<br></br>
					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr>
							<td width="65%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="right" style='text-align:right;line-height:normal'>
									<span style='font-size:10.0pt'></span>
								</p>
							</td>
							<td width="50%" valign="top">
								<p class="MsoNormal" align="left" style='line-height:normal'>
									<span style='font-size:10.0pt'>
										<xsl:value-of select="$t_approve"/>
									</span>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr>
							<td width="65%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="auto" colspan="3" valign="top">
								<p class="MsoNormal" style='line-height:normal;text-align:left;'>
									<span style='font-size:10.0pt'>
										<xsl:value-of select="$t_head_cathedra"/>
										<xsl:text>&#x20;</xsl:text>
										<xsl:value-of select='string(item[@name="CathedraName"])' disable-output-escaping='no'/>
									</span>
								</p>
							</td>
							<td width="5%" style='border:none'></td>
						</tr>
						<tr height="30">
							<td width="65%" style='border:none'></td>
							<td width="10%" style='vertical-align:bottom;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="5%" style='border:none'></td>
							<td width="15%" style='vertical-align:bottom;width:126.0pt;border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='text-align:center;line-height:normal'>
									<span style='font-size:10.0pt;text-align:center;'>
										<xsl:value-of select='string(item[@name="HeadCathedra"])' disable-output-escaping='no'/>
									</span>
								</p>
							</td>
							<td width="5%" style='border:none'></td>
						</tr>
						<tr>
							<td width="65%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="10%" valign="top" style='border:none;border-top:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_signature"/>
									</span>
								</p>
							</td>
							<td width="5%" style='border:none'></td>
							<td width="15%" valign="top" style='border:none;border-top:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_name_initials"/>
									</span>
								</p>
							</td>
							<td width="5%" style='border:none'></td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr>
							<td width="65%" valign="top">
								<p class="MsoNormal" style='line-height:normal;text-align:right;'>
									<span style='font-size:10.0pt'>«</span>
								</p>
							</td>
							<td width="5%" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'>
									<span style='font-size:10.0pt'><![CDATA[ ]]></span>
								</p>
							</td>
							<td width="1%" valign="top">
								<p class="MsoNormal" style='line-height:normal'>
									<span style='font-size:10.0pt'>»</span>
								</p>
							</td>
							<td width="20%" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal;'>
									<span style='font-size:10.0pt'><![CDATA[ ]]></span>
								</p>
							</td>
							<td width="auto" valign="top">
								<p class="MsoNormal" style='line-height:normal;'>
									<span style='font-size:10.0pt'>
										<xsl:value-of select='string(@year)' disable-output-escaping='no'/>
									</span>
								</p>
							</td>
							<td width="auto" valign="top">
								<p class="MsoNormal" style='line-height:normal;text-align:right;'>
									<span style='font-size:10.0pt'></span>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<table class="MsoTableGrid" width="100%" border="1" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse;border:none'>
						<tr>
							<td width="100%" valign="top" style='width:478.5pt;border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal; height:50pt'>
									<![CDATA[ ]]>
								</p>
							</td>
						</tr>
						<tr>
							<td width="100%" valign="top" style='width:478.5pt;border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span style='font-size:11.0pt;font-family:Impact;letter-spacing:3.0pt'>
										<xsl:value-of select="$t_title"/>
									</span>
								</p>
							</td>
						</tr>
						<tr style='height:12.75pt'>
							<td width="638" style='width:478.5pt;border:none;padding:0cm 5.4pt 0cm 5.4pt;height:32.75pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<![CDATA[ ]]>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<table width="100%" class="MsoTableGrid" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr>
							<td width="221px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_student_group"/>
									</span>
								</p>
							</td>
							<td width="10%" valign="bottom" style='border-top:none;border-bottom:solid windowtext 1.0pt;border-right:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:center;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="Group"])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
							<td width="2%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'>
									<span style='font-size:14.0pt'><![CDATA[ ]]></span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:center;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="Student"])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
						<tr>
							<td width="221px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span style='font-size:10.0pt'><![CDATA[ ]]></span>
								</p>
							</td>
							<td width="10%" valign="bottom" style='border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_group_number"/>
									</span>
								</p>
							</td>
							<td width="2%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'>
									<span style='font-size:14.0pt'><![CDATA[ ]]></span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_initials_surname"/>
									</span>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
					<br/>

					<!-- Пункт 1: Тема проекта -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="128px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item1"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="Theme" and number(@line)=0])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
						<xsl:apply-templates select='item[@name="Theme" and number(@line)&gt;0]'/>
					</table>

					<!-- Пункт 2: Срок сдачи -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="338px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item2"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="EndData"])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
					</table>

					<!-- Пункт 3: Исходные данные -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="223px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item3"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="InputData" and number(@line)=0])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
						<xsl:apply-templates select='item[@name="InputData" and number(@line)&gt;0]'/>
					</table>

					<!-- Пункт 4: Содержание РПЗ -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="344px" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item4"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" style='line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="RPZContent" and number(@line)=0])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
					</table>

					<!-- Пункт 5: Перечень графического материала -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<xsl:apply-templates select='item[@name="RPZContent" and number(@line)&gt;0]'/>
						<tr style='height:17.55pt'>
							<td width="265px" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item5"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="DrawMaterials" and number(@line)=0])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
						<xsl:apply-templates select='item[@name="DrawMaterials" and number(@line)&gt;0]'/>
					</table>

					<!-- Пункт 6: Консультанты -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="423px" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item6"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<i>
										<xsl:value-of select='string(item[@name="Consultants" and number(@line)=0])' disable-output-escaping='no'/>
									</i>
								</p>
							</td>
						</tr>
						<xsl:apply-templates select='item[@name="Consultants" and number(@line)&gt;0]'/>
					</table>

					<!-- Пункт 7: Дата выдачи -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="173px" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item7"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<i>
										<xsl:if test="string(item[@name='Student']) != ''">
											<xsl:value-of select='string(item[@name="PublishData"])' disable-output-escaping='no'/>
										</xsl:if>
									</i>
								</p>
							</td>
						</tr>
					</table>

					<!-- Пункт 8: Календарный график -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr style='height:17.55pt'>
							<td width="430px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item8"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'><![CDATA[ ]]></p>
							</td>
						</tr>
						<tr style='height:17.55pt'>
							<td width="430px" valign="bottom" style='padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_item8_sub"/>
									</span>
								</p>
							</td>
							<td width="auto" valign="bottom" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'><![CDATA[ ]]></p>
							</td>
						</tr>
						<xsl:apply-templates select='item[@name="Workflow" and number(@line)&gt;=0]'/>
					</table>

					<br></br>
					<br></br>
					<br></br>
					<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>

					<!-- Руководитель -->
					<table class="MsoTableGrid" width="100%" border="0" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse'>
						<tr>
							<td width="50%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal; text-align:left;'>
									<span>
										<xsl:value-of select="$t_supervisor"/>
									</span>
								</p>
							</td>
							<td width="20%" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span style='font-size:10.0pt'>
										<xsl:if test="string(item[@name='Student']) != ''">
											<xsl:value-of select='string(item[@name="PublishData"])' disable-output-escaping='no'/>
										</xsl:if>
									</span>
								</p>
							</td>
							<td width="10%" valign="top" style='padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="20%" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span>
										<xsl:value-of select='string(item[@name="Lecturer"])' disable-output-escaping='no'/>
									</span>
								</p>
							</td>
						</tr>
						<tr>
							<td width="50%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'>
									<b><![CDATA[ ]]></b>
								</p>
							</td>
							<td width="20%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_signature_date"/>
									</span>
								</p>
							</td>
							<td width="10%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="20%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_name_initials"/>
									</span>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'>
						<span lang="EN-US"><![CDATA[ ]]></span>
					</p>

					<!-- Студент принял задание -->
					<table class="MsoTableGrid" width="100%" border="1" cellspacing="0" cellpadding="0"
					  style='border-collapse:collapse;border:none'>
						<tr style='height:17.55pt'>
							<td width="50%" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span style='font-size:10.0pt'></span>
								</p>
							</td>
							<td width="20%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="10%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="20%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
						</tr>
						<tr style='height:17.55pt'>
							<td width="50%" valign="bottom" style='border:none;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span>
										<xsl:value-of select="$t_student_accepted"/>
									</span>
								</p>
							</td>
							<td width="20%" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
									<span style='font-size:10.0pt'>
										<xsl:if test="string(item[@name='Student']) != ''">
											<xsl:value-of select='string(item[@name="PublishData"])' disable-output-escaping='no'/>
										</xsl:if>
									</span>
								</p>
							</td>
							<td width="10%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="20%" valign="top" style='border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span>
										<xsl:value-of select='string(item[@name="Student"])' disable-output-escaping='no'/>
									</span>
								</p>
							</td>
						</tr>
						<tr>
							<td width="50%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'>
									<b><![CDATA[ ]]></b>
								</p>
							</td>
							<td width="20%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_signature_date"/>
									</span>
								</p>
							</td>
							<td width="10%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" style='line-height:normal'><![CDATA[ ]]></p>
							</td>
							<td width="20%" valign="top" style='border:none;padding:0cm 5.4pt 0cm 5.4pt'>
								<p class="MsoNormal" align="center" style='text-align:center;line-height:normal'>
									<span style='font-size:8.0pt'>
										<xsl:value-of select="$t_name_initials"/>
									</span>
								</p>
							</td>
						</tr>
					</table>

					<p class="MsoNormal" style='line-height:normal'>
						<span lang="EN-US"><![CDATA[ ]]></span>
					</p>

				</div>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="item">
		<tr style='height:17.55pt'>
			<td width="638" colspan="8" valign="bottom" style='width:478.5pt;border:none;border-bottom:solid windowtext 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:17.55pt'>
				<p class="MsoNormal" align="left" style='text-align:left;line-height:normal'>
					<i>
						<xsl:value-of select='string(.)' disable-output-escaping='no'/>
					</i>
				</p>
			</td>
		</tr>
	</xsl:template>

</xsl:stylesheet>
