package rogatkin.test.beejsmultiselect.ux;

import org.aldan3.model.DOFactory;
import org.aldan3.model.ProcessException;

import java.io.StringReader;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.HashMap;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;

import org.aldan3.data.DODelegator;
import org.aldan3.model.DataObject;
import org.aldan3.util.DataConv;
import org.aldan3.util.Sql;
import com.beegman.webbee.block.Form;
import rogatkin.test.beejsmultiselect.model.BeejsmultiselectModel;
import rogatkin.test.beejsmultiselect.model.book;
import rogatkin.test.beejsmultiselect.model.tag;
import rogatkin.test.beejsmultiselect.model.tag_conn;

public class Book extends Form<book, BeejsmultiselectModel> {

	@Override
	protected book getFormModel() {
		return new book(getAppModel());
	}

	@Override
	protected book loadModel(book jdo) {
		try {
			Collection<DataObject> ct = getTags(jdo);
			JsonArrayBuilder jb = Json.createArrayBuilder();
			for (Iterator<DataObject> i = ct.iterator(); i.hasNext();) {
				DataObject t = i.next();
				jb.add(Json.createObjectBuilder().add("tag", (String) t.get("NAME")).add("descr",
						DataConv.objectToString(t.get("DESCRIPTION"))));
			}
			jdo.tags = jb.build().toString();
			log("tags %s", null, jdo.tags);
			jdo().getObjectLike(new DODelegator<book>(jdo, null, "", "id"));
			return jdo;
		} catch (ProcessException e) {
			log("", e);
		}
		return null;
	}

	@Override
	protected Object storeModel(book jdo) {
		// log("tags %s",null, jdo.tags);
		DODelegator<book> djdo = new DODelegator<>(jdo, null, "", "id");
		try {
			jdo().addObject(djdo, "id", jdo.id <= 0 ? null : djdo);
			log("c/u %s", null, "" + jdo.id);

			if (jdo.tags != null) {
				// updatng tags
				JsonArray jsa = Json.createReader(new StringReader(jdo.tags)).readArray();

				String[] tags = new String[jsa.size()];
				for (int i = 0; i < tags.length; i++)
					tags[i] = jsa.getString(i); // TODO add HTML encode?
				Arrays.sort(tags);
				// read current tags
				tag_conn tc = new tag_conn(getAppModel());

				Collection<DataObject> ct = getTags(jdo);

				ArrayList<String> toAdd = new ArrayList<>(Arrays.asList(tags)); // TODO change to Set
				ArrayList<Long> toDel = new ArrayList<>();
				for (Iterator<DataObject> i = ct.iterator(); i.hasNext();) {
					DataObject t = i.next();
					//log("conn-obj %s", null, t);
					if (Arrays.binarySearch(tags, t.get("NAME")) < 0)
						toDel.add((Long) t.get("TAG_ID"));
					else
						toAdd.remove(t.get("NAME"));
				}
				// find out the the tags to delete
				jdo().updateQuery("delete from tag_conn where book_id=" + jdo.id + " and tag_id in ("
						+ DataConv.collectionToString(toDel, ",", "-1") + ")");
				// find additional to current to add
				tag tg = new tag(getAppModel());
				for (String tgn : toAdd) {
					tg.name = tgn;
					if (jdo().getObjectLike(new DODelegator<tag>(tg, null, "", "name")) == null) {
						jdo().addObject(new DODelegator<tag>(tg, null, "", "id"), "id", null);
						log("conn-obj %d", null, tg.id);
					}
					tc.book_id = jdo.id;
					tc.tag_id = tg.id;
					jdo().addObject(new DODelegator<tag_conn>(tc));
				}
				//log("tags %s", null, Arrays.toString(tags));
			}
			navigation = "Books?name=";
		} catch (ProcessException e) {
			log("", e);
			return e;
		}
		return null;
	}

	private Collection<DataObject> getTags(book jdo) throws ProcessException {
		return jdo().getObjectsByQuery(
				"select tag_id, name, description from tag_conn join tag on(tag.id=tag_id) where book_id=" + jdo.id, 0,
				100, null);
	}

	///////////////////// Ajax calls ///////////////////////////////////////////
	public HashMap<String, Collection<DataObject>> processallTagsCall() {
		String f = getParameterValue("filter", "", 0);
		HashMap<String, Collection<DataObject>> res = new HashMap<>();
		try {
			res.put(MODEL,
			jdo().getObjectsByQuery(
					"select ID, NAME as tag, description from tag where name like '%" + Sql.escapeQuote(f) + "%'", 0, 100,
					null));
		} catch (ProcessException e) {
			log("", e);
		}
		return res;
	}
	
	public String getallTagsViewName() {
		return "alltags-json.html";
	}

}